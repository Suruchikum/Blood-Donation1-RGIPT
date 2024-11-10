const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    clientSecret: process.env.GMAIL_CLIENTSECRET,
    refreshToken: process.env.GMAIL_RFRESHTOKEN,
    accessToken: process.env.GMAIL_ACCESSTOKEN,
  },
});

const mailOptions = {
  from: process.env.MAIL_USERNAME,
  to: "",
  bcc: process.env.MAIL_BCC,
  subject: "",
  text: "",
};

module.exports = { transporter, mailOptions };
