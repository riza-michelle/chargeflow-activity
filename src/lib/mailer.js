const nodemailer = require("nodemailer");

const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
const MAIL_SENDER = process.env.MAIL_SENDER;

async function sendMail(recipient, subject, message, options = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USERNAME,
      pass: GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: MAIL_SENDER,
    to: recipient,
    subject: subject,
    text: message,
    ...options,
  };

  return transporter.sendMail(mailOptions);
}

exports.sendMail = sendMail;
