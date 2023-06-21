import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';
import { mgClient } from '.';
import { bodyHtml, bodyText, subjectText } from './mailTemplate';

export const sendMailHandler = async (req: Request, res: Response) => {
  let { name = '', from = '' } = req.body;
  if (name !== '') {
    name = ' ' + name;
  }

  try {
    // TODO: check user's JWT token validity
    // TODO: check if user is under daily quota
    const mailgunResponse = await sendMailMailgun(
      name,
      from || `${process.env.MAILGUN_VERIFIED_SENDER!}`,
      5000
    );

    res.send({
      result: 'Mail sent successfully via mailgun.',
      response: mailgunResponse,
    });
  } catch (e) {
    try {
      const sendgridResponse = await sendMailSendgrid(
        name,
        from || process.env.SENDGRID_VERIFIED_SENDER!,
        5000
      );
      res.send({
        result: 'Mail sent successfully via sendgrid.',
        response: sendgridResponse,
      });
    } catch (e) {
      res.status(500).send({ result: `Error sending mail. ${e}` });
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

const sendMailMailgun = async (name: string, from: string, timeout: number) => {
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

const sendMailSendgrid = async (
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
    //TODO
    // 1. Check if user is admin
    // 2. Get list of users and daily sent mails
    // 3. Return list of users and daily sent mails
    res.send({ result: 'Stats sent successfully.' });
  } catch (e) {
    res.status(500).send({ result: 'Error sending stats.' + e });
  }
};
