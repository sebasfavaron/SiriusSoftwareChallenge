import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Database to store registered users (in-memory representation)
const usersDB: { [username: string]: string } = {};

export const registerHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (usersDB[username]) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to hash password. ' + err });
    }

    // Store the username and hashed password in the database
    usersDB[username] = hash;
    res.status(201).json({ message: 'User registered successfully' });
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if the username exists in the database
  const hashedPassword = usersDB[username];
  if (!hashedPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with a 1-hour expiration
    const token = jwt.sign({ username }, process.env.SECRET_KEY!, {
      expiresIn: '20s',
    });
    res.json({ token });
  });
};

const invalidatedTokens: { token: string; exp: number }[] = [];

export const logoutHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Could not logout. Unauthorized' });
  }
  const { token, exp } = req.user;

  // Add the token to the invalidated tokens list
  invalidatedTokens.push({ token, exp });
  console.log('Invalidated tokens: ', invalidatedTokens);
  removeExpiredTokens(); // TODO: move to a cron job
  console.log('Invalidated tokens after cleanup: ', invalidatedTokens);

  res.json({ message: 'Logout successful' });
};

const removeExpiredTokens = () => {
  const now = Date.now();
  invalidatedTokens.forEach((token, index) => {
    if (now >= token.exp * 1000) {
      invalidatedTokens.splice(index, 1);
    }
  });
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY!, (err: any, decoded: any) => {
    if (err || invalidatedTokens.find((t) => t.token === token)) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if the token has expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }

    // Add the decoded payload to the request object
    req.user = { ...decoded, token };

    next();
  });
};
