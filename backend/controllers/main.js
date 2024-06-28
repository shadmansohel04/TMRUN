const CustomAPIError = require('../errors/custom-error')
const transporter = require('../models/mailer')

const homeGet = async(req, res)=>{
    res.status(200).json({msg:"on the home page"})
}

const aboutGet = async (req, res)=>{
    res.status(200).send('yayayaya')
}

const sendContact = async(req, res)=>{
    try {
        const {email, subject, message} = req.body
    
        transporter.sendMail({
            from: 'shadman2354@gmail.com',
            to: 'shadman.sohel04@gmail.com',
            subject: subject,
            text: email + " \n" + message
        }, (error, info) => {
            if (error) {
                return next(new CustomAPIError(400, 'Proper email not given'));
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        res.status(200).send({success: true})
    } catch (error) {
        res.status(200).send({success: false})
    }
}

module.exports = {
    homeGet,
    aboutGet,
    sendContact
}