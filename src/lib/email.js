import template from './email.html?raw';
import axios from 'axios';
import * as Sentry from "@sentry/sveltekit";

const a1 = atob('YXBpLWtleQ==');
const b1 = atob(
  'eGtleXNpYi0xZTVlNGViYjBhOGYyZjUyMDlmYzQ3MWY5MzZmYjY5NzkyMWRiNzViZjQzN2FlOWVmNjAxYmIxZmJlNmRkNDY1LTc1a3ZYb2hoMUJRTDBubk4='
);

const sendEmail = async (id, decors, name, mail, information) => {
  let data = '';
  let i = 1;
  decors.forEach((e) => {
    data += `<tr>
    <td rowspan="2"
      style="text-align: center; vertical-align: middle;padding:0;border-bottom: 1px dotted black;">
      ${i++}</td>
    <td style="text-align: center; vertical-align: middle;padding:0;">${e.code}</td>
    <td style="text-align: center; vertical-align: middle;padding:0;">${e.name}</td>
    <td style="text-align: center; vertical-align: middle;padding:0;">${e.description}</td>
    <td rowspan="2"
      style="text-align: center; vertical-align: middle;padding:0;border-bottom: 1px dotted black;">
      ${e.quantity}</td>
  </tr>
  <tr>
    <td colspan="1"
      style="text-align: center; vertical-align: middle;padding:0;border-bottom: 1px dotted black;">
      Dimensions(mm)
    </td>
    <td colspan="2"
      style="text-align: center; vertical-align: middle;padding:0;border-bottom: 1px dotted black;">
      ${e.width}x${e.length}x${e.thickness}
    </td>
  </tr>`;
  });

  let html = template.replace('[NAME]', name);
  html = html.replace('[DATA]', data);
  if (information.trim() !== '') {
    let info = `<tr><td><strong>Additional information:<br></strong> ${information}</td></tr><tr><td height="10">&nbsp;</td></tr>`;
    html = html.replace('[INFO]', info);
  } else {
    html = html.replace('[INFO]', '');
  }
  let subject = `Pricing #${id}`;
  if (name.trim() === '') {
    subject = `Pricing for ${name} #${id}`;
  }

  // @ts-ignore
  let r = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        name: 'L2 Interior Joinery',
        email: 'juicy.decor.uk@gmail.com'
      },
      to: [{ email: mail }],
      cc: [{ email: 'juicy.decor.uk@gmail.com', name: 'L2 Interior Joinery' }],
      replyTo: { email: 'juicy.decor.uk@gmail.com' },
      subject: subject,
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
