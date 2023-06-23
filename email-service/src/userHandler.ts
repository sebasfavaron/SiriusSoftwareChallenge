import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername } from './userDB';

const registerHelper = async (req: Request, res: Response, role: string) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  const user = await getUserByUsername(username);
  if (user !== null) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash the password
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    // Store the username and hashed password in the database
    createUser(username, hash, role, 0);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: `Failed to register user. ${error}` });
  }
};

export const registerHandler = async (req: Request, res: Response) => {
  registerHelper(req, res, 'user');
};

export const registerAdminHandler = async (req: Request, res: Response) => {
  const { role } = req.user!;
  if (role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized ((not an admin))' });
  }

  registerHelper(req, res, 'admin');
};

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if the username exists in the database
  const user = await getUserByUsername(username);
  if (user === null) {
    return res
      .status(401)
      .json({ error: 'Invalid credentials ((no such username))' });
  }
  const hashedPassword = user.password;
  const role = user.role;

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err || !result) {
      return res
        .status(401)
        .json({ error: 'Invalid credentials ((password does not match))' });
    }

    // Generate a JWT token with a 1-hour expiration
    const token = jwt.sign({ username, role }, process.env.SECRET_KEY!, {
      expiresIn: '1h',
    });
    res.json({ token });
  });
};

export type UserGuardType = {
  isAuthenticated(req: Request): boolean;
  isAuthorized: {
    hasBearer: (authHeader?: string) => boolean;
    skipTokenVerification: () => boolean;
  };
};

export const userGuard: UserGuardType = {
  isAuthenticated(req: Request): boolean {
    return req.user?.role === 'admin';
  },

  isAuthorized: {
    hasBearer: (authHeader?: string): boolean => {
      return !authHeader || !authHeader.startsWith('Bearer ');
    },
    skipTokenVerification: (): boolean => {
      return false;
    },
  },
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers.authorization;

  if (!userGuard.isAuthorized.hasBearer(authHeader)) {
    return res
      .status(401)
      .json({ error: 'Unauthorized ((missing Bearer Token))' });
  }

  if (userGuard.isAuthorized.skipTokenVerification()) {
    req.user = {
      username: 'user',
      role: 'user',
      exp: 123456,
      token: 'fake-token',
    };
    next();
  } else {
    if (!authHeader) {
      console.log('no authHeader');
      return res
        .status(401)
        .json({ error: 'Unauthorized ((missing Bearer Token))' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;

      // Check if the token has expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ error: 'Token expired' });
      }

      // Add the decoded payload to the request object
      req.user = { ...decoded, token };

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized ((invalid token))' });
    }
  }
};

export const isAdmin = async (req: Request, res: Response, next: Function) => {
  if (!userGuard.isAuthenticated(req)) {
    return res.status(403).send({ result: 'Access forbidden' });
  }

  next();
};
