const CustomAPIError = require('../errors/custom-error')
const transporter = require('../models/mailer')
const axios = require("axios")

const homeGet = async(req, res)=>{
    res.status(200).json({msg:"on the home page"})
}

const aboutGet = async (req, res)=>{
    res.status(200).send('yayayaya')
}

const sendContact = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;

    const location = await axios.get(`https://ipapi.co/${ip}/json/`)
      .then(r => r.data)
      .catch(() => null);

    await transporter.sendMail({
      from: req.body.email,
      to: process.env.CONTACT_EMAIL,
      subject: "New Contact Form Submission",
      text: `
Name: ${req.body.name}
Email: ${req.body.email}
Message: ${req.body.message}

---- IP INFORMATION ----
IP Address: ${ip}
Location: ${location ? JSON.stringify(location, null, 2) : "Unavailable"}
      `,
      html: `
        <p><strong>Name:</strong> ${req.body.name}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Message:</strong><br>${req.body.message}</p>

        <hr>
        <h3>IP Information</h3>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>Location:</strong></p>
        <pre>${location ? JSON.stringify(location, null, 2) : "Unavailable"}</pre>
      `
    });

    res.status(200).send({
      success: true,
      ip,
      location
    });
  } catch (error) {
    console.log(error)
    res.status(200).send({ 
        success: false, 
        error: error
    });
  }
};


module.exports = {
    homeGet,
    aboutGet,
    sendContact
}