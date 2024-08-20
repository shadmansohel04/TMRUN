const nodemailer = require("nodemailer");
require('dotenv').config(); // Import dotenv to read environment variables from .env file

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tmrun.mail.co@gmail.com",
    pass: "hgka paik giwk wsnk",
  },
});

module.exports = transporter