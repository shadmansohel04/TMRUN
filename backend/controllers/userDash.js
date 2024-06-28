const CustomAPIError = require('../errors/custom-error')
const User = require('../models/user')
const Strava = require('../models/stravaData')
const jwt = require('jsonwebtoken')
const {getRecentRuns} = require('../controllers/stravaAPI')

const switchLeader = async (req, res)=>{
    try {
        const {userId, newLeader} = req.body
        const stravaData = await Strava.findOne({person: userId})
        let msg = ""
        if(newLeader == "Join The Leaderboard"){
            stravaData.leaderboard = true
            msg = "Leave The Leaderboard"
        }
        else if(newLeader == "Leave The Leaderboard"){
            stravaData.leaderboard = false
            msg = "Join The Leaderboard"
        }
        else{
            throw new CustomAPIError(400, msg)
        }

        stravaData.save()

        return res.status(200).send({success: true, newLeader: msg})
    } catch (error) {
        console.log(error)
    }
}

const getUserInfo = async (req, res)=>{
    try {
        const token = req.headers.authorization
        const person = await jwt.verify(token, process.env.JWT_SECRET) 
        if(person.userId != req.params.id){
            return res.status(200).send({success: false, msg: "need to huhh"})
        }     
        const userId = req.params.id   
        const stravaData = await getRecentRuns(userId)
        const user = await User.findById({_id: userId})
        return res.status(200).send({success: true, user: user.username, data: stravaData.data, scores: stravaData.scores})
    } catch (error) {
        return res.status(200).send({success: false, msg: "need to login"})
    }
}

module.exports = {getUserInfo, switchLeader}