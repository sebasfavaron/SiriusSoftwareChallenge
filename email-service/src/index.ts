import sgMail from '@sendgrid/mail';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { mailStatsHandler, sendMailHandler } from './mailHandler';
import {
  authMiddleware,
  loginHandler,
  logoutHandler,
  registerHandler,
} from './userHandler';

dotenv.config();

// Set up mail services
const mailgun = new Mailgun(formData);
export const mgClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const app: Express = express();
const port = process.env.PORT;

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { username: string; role: string; token: string; exp: number };
    }
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('Mail server is running.');
});

const corsOptions: CorsOptions = {
  origin: true, // TODO: only allow frontend URL
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/register', registerHandler);

app.post('/login', loginHandler);

app.post('/logout', authMiddleware, logoutHandler);

app.get('/stats', mailStatsHandler); // TODO: add auth and check admin role

app.post('/send-mail', authMiddleware, sendMailHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
