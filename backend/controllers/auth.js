const bcrypt = require('bcryptjs');
const User = require('../models/user');
const StravaData = require('../models/stravaData')
const {updateStrava} = require('../controllers/stravaAPI')
const CustomAPIError = require('../errors/custom-error')
const jwt = require('jsonwebtoken')

async function encryptPassword(password){
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw CustomAPIError(400, 'encrypt failed');
    }
}

const confirmEmail = async (req, res) =>{
    try {
        const userId = await jwt.verify(req.params.token, process.env.JWT_SECRET).userId
        const user =  await User.findOne({_id: userId})
        if(!user){
            throw CustomAPIError(400, 'unable to confirm person')   
        }
        user.authorized = true
        await user.save()
        const NEWURL = `https://www.strava.com/oauth/authorize?client_id=128690&redirect_uri=http://localhost:3000/home/STRAVALINK?user_id%3D${userId}&response_type=code&scope=activity:read_all`

        return res.status(200).send(`<h1>CONFIRMED EMAIL</h1>` + `<a href="${NEWURL}">Connect Strava</a>`)
    } catch (error) {
        console.log(error)
    }
}

const signUp = async (req, res) => {
    const {username, password, email} = req.body;
    if (!username || !password || !email) {
        return res.status(200).send({success: false, msg: 'Please enter required information'});
    }
    
    if(!email.endsWith('@torontomu.ca') && !email.endsWith('@gmail.com') && !email.endsWith('@hotmail.com')){
        return res.status(200).send({success: false, msg: 'Please enter a valid email'});
    }

    try {
        const usernameCheck = await User.findOne({ username: username });
        if (usernameCheck) {
            return res.status(200).send({success: false, msg: 'Username already exists'});
        }
        
        const emailCheck = await User.findOne({ email: email });
        if (emailCheck && emailCheck.authorized == true) {
            return res.status(200).send({success: false, msg: 'Person already used'});
        }

        if(emailCheck && emailCheck.authorized == false){
            await StravaData.findOneAndDelete({person: emailCheck._id})
            await User.findOneAndDelete({email: email})
            return res.status(200).send({success: false, msg: 'Please try again'});
        }

        if (password.length < 4) {
            return res.status(200).send({success: false, msg: 'Password needs to be 4 or more characters'});
        }

        const hashedPassword = await encryptPassword(password); 

        await User.create({
            username: username,
            password: hashedPassword,
            email: email
        });

        return res.status(201).send({success: true, msg: "User created successfully"});

    } catch (error) {
        console.error('Sign up error:', error);
        return res.status(500).send({success: false, msg: 'Internal server error'});
    }
};

const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        
        if(!user || user.authorized == false){
            return res.status(200).send({success: false, msg: "Person does not exist"})
        }   
        
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(200).send({success: false, msg: "Incorrect credentials"})
        }
        const headerToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {expiresIn: "2h"}
        )
        await updateStrava(user.id)
        return res.status(200).send({
            success: true, 
            userId: user.id,
            token: headerToken, 
            msg:'YOU LOGGED IN'
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {signUp, login, confirmEmail};
