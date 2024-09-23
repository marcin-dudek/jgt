import template from './email.html?raw';
import axios from 'axios';
import * as Sentry from "@sentry/sveltekit";

const a1 = atob('YXBpLWtleQ==');
const b1 = atob(
  'eGtleXNpYi0xZTVlNGViYjBhOGYyZjUyMDlmYzQ3MWY5MzZmYjY5NzkyMWRiNzViZjQzN2FlOWVmNjAxYmIxZmJlNmRkNDY1LTc1a3ZYb2hoMUJRTDBubk4='
);

const sendEmail = async (name, mail, content) => {
  let html = template.replace('[NAME]', name);
  if (content.trim() !== '') {
    let info = `<tr><td><strong>Your message:<br></strong> <i>${content}</i></td></tr><tr><td height="10">&nbsp;</td></tr>`;
    html = html.replace('[INFO]', info);
  } else {
    html = html.replace('[INFO]', '');
  }

  // @ts-ignore
  let r = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        name: 'Just Get Trained',
        email: 'contact@just-get-trained.com'
      },
      to: [{ email: mail }],
      cc: [{ email: 'contact@just-get-trained.com', name: 'Just Get Trained' }],
      replyTo: { email: 'contact@just-get-trained.com' },
      subject: 'Just Get Trained - contact',
      htmlContent: html
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        [a1]: b1
      }
    }
  );

  Sentry.captureMessage(`Email sent - status: ${r.status}, ${r.statusText}.`, 'info');

  return r.status <= 299;
};

export default sendEmail;
