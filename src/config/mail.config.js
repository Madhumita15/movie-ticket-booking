require("dotenv").config();
const nodemailer = require("nodemailer");
console.log("SMTP HOST:", process.env.EMAIL_HOST);
console.log("SMTP USER:", !!process.env.EMAIL_USER);
console.log("SMTP PASS:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 150000,
});

module.exports = transporter;

