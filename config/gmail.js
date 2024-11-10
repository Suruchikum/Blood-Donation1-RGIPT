const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const getAccessToken = async () => {
  try {
    const res = await oauth2Client.getAccessToken();
    return res?.token || null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};
const sendMail = async (subject, message, recipient) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: recipient,
      bcc: process.env.MAIL_BCC,
      subject,
      text: message,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Mail sent to ${info.accepted}`);
    return { success: true, message: info };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
module.exports = { sendMail };
