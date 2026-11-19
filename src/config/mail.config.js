require("dotenv").config();
const nodemailer = require("nodemailer");
const dns = require("dns");

dns.promises.lookup(process.env.EMAIL_HOST)
    .then((result) => {
        console.log("SMTP DNS resolved:", result);
    })
    .catch((error) => {
        console.error("SMTP DNS failed:", error.code);
    });

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

