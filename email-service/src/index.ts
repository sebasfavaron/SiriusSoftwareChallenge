import sgMail from '@sendgrid/mail';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { mailStatsHandler, sendMailHandler } from './mailHandler';

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

app.get('/', (req: Request, res: Response) => {
  res.send('Mail server is running.');
});

const corsOptions: CorsOptions = {
  origin: true, // TODO: Change this to the frontend URL
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/stats', mailStatsHandler);

app.post('/send-mail', sendMailHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
