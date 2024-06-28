const User = require('../models/user');
const CustomAPIError = require('../errors/custom-error')
const jwt = require('jsonwebtoken')

const checkAuthorization = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new CustomAPIError(401, 'Authorization token is missing');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new CustomAPIError(404, 'User not found');
        }
        console.log('confirmed')
        next();

    } catch (error) {
        console.log(error)
        res.status(200).send({success: false, msg: "nope"})   
    }
};

module.exports = {checkAuthorization}