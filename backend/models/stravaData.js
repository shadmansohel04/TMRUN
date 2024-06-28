const mongoose = require('mongoose')

const stravaData = new mongoose.Schema({
    person:{
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: [true, "need a person"]
    },
    recentRuns:{
        type: Array
    },
    stravaID:{
        type: String,
        default: "empty"
    },
    lastThreeRuns:{
        type: Array
    },
    scores:{
        type: Object
    },
    leaderboard:{
        type: Boolean,
        default: false
    },
    weight:{
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model('stravaData', stravaData)