const nodemailer = require("nodemailer");
require('dotenv').config(); // Import dotenv to read environment variables from .env file

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shadman2354@gmail.com",
    pass: "vvgy nojg myzo yydm",
  },
});

module.exports = transporter