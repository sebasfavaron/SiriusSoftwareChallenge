import { Request, Response } from 'express';
import { mgClient } from '.';

export const sendMailHandler = async (req: Request, res: Response) => {
  try {
    const { text = 'Testing some Mailgun awesomeness!' } = req.body;
    // TODO: failover in case mailgun fails
    // TODO: check user's JWT token validity
    // TODO: check if user is under daily quota
    await mgClient.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN!}>`,
      to: [process.env.MAILGUN_TEST_MAIL!],
      subject: 'Hello',
      text,
    });
    res.send({ result: 'Mail sent successfully.' });
  } catch (e) {
    res.status(500).send({ result: 'Error sending mail.' + e });
  }
};

export const mailStatsHandler = async (req: Request, res: Response) => {
  try {
    //TODO
    // 1. Check if user is admin
    // 2. Get list of users and daily sent mails
    // 3. Return list of users and daily sent mails
  } catch (e) {
    res.status(500).send({ result: 'Error sending stats.' + e });
  }
};
