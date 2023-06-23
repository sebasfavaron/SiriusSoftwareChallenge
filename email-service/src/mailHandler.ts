import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';
import { mgClient } from '.';
import { bodyHtml, bodyText, subjectText } from './mailTemplate';
import { getUserByUsername, getUsersDailyMailsSent } from './userDB';

export const sendMailHandler = async (req: Request, res: Response) => {
  let { name = '', from = '' } = req.body;
  if (name !== '') {
    name = ' ' + name;
  }
  const { username } = req.user!;
  let dbUser = null;

  try {
    dbUser = await getUserByUsername(username);
    if (dbUser === null) {
      return res
        .status(401)
        .send({ result: 'Invalid credentials ((no such username))' });
    } else if (dbUser.dailyMailsSent >= +process.env.DAILY_MAIL_QUOTA!) {
      return res.status(401).send({
        result: 'Unauthorized. Daily mail quota exceeded.',
        dailyMailsSent: dbUser.dailyMailsSent,
      });
    }

    const sendgridResponse = await sendMailSendgrid(
      name,
      from || process.env.SENDGRID_VERIFIED_SENDER!,
      5000
    );
    await dbUser.incrementDailyMailsSent();
    res.send({
      result: 'Mail sent successfully via sendgrid.',
      response: sendgridResponse,
    });
  } catch (error) {
    if (dbUser === null) {
      return res
        .status(401)
        .send({ result: 'Invalid credentials ((no such username))' });
    }
    try {
      const mailgunResponse = await sendMailMailgun(
        name,
        from || process.env.MAILGUN_VERIFIED_SENDER!,
        5000
      );
      await dbUser.incrementDailyMailsSent();
      res.send({
        result: 'Mail sent successfully via mailgun.',
        response: mailgunResponse,
      });
    } catch (error) {
      res.status(500).send({ result: `Error sending mail. ${error}` });
    }
  }
};

async function sendRequestWithTimeout<T>(
  request: () => Promise<T>,
  timeout: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Set a timeout for the request
    const timeoutObj = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    // Send the request
    try {
      const response = request();
      clearTimeout(timeoutObj); // Clear the timeout if the request succeeds
      resolve(response);
    } catch (error) {
      clearTimeout(timeoutObj); // Clear the timeout if the request fails
      reject(error);
    }
  });
}

export const sendMailMailgun = async (
  name: string,
  from: string,
  timeout: number
) => {
  return sendRequestWithTimeout(
    async () =>
      mgClient.messages.create(process.env.MAILGUN_DOMAIN!, {
        from,
        to: [process.env.TEST_MAIL_RECIPIENT!],
        subject: subjectText,
        text: bodyText(name, 'mailgun'),
        html: bodyHtml(name, 'mailgun'),
      }),
    timeout
  );
};

export const sendMailSendgrid = async (
  name: string,
  from: string,
  timeout: number
) => {
  return sendRequestWithTimeout(
    async () =>
      sgMail.send({
        from,
        to: process.env.TEST_MAIL_RECIPIENT!,
        subject: subjectText,
        text: bodyText(name, 'sendgrid'),
        html: bodyHtml(name, 'sendgrid'),
      }),
    timeout
  );
};

export const mailStatsHandler = async (req: Request, res: Response) => {
  try {
    const usersDailyMailsSent = await getUsersDailyMailsSent();

    res.send({
      result: usersDailyMailsSent,
    });
  } catch (error) {
    res.status(500).send({ result: `Error sending stats. ${error}` });
  }
};
