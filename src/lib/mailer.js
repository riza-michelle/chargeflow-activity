const nodemailer = require("nodemailer");

async function sendMail(recipient, subject, message, options = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: recipient,
    subject: subject,
    text: message,
    ...options,
  };
  return transporter.sendMail(mailOptions);
}

exports.sendMail = sendMail;
