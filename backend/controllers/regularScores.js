const Strava = require('../models/stravaData')

const time_20k = async (userID)=>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let alldata = stravaData.recentRuns
        
        alldata = alldata.filter(each => each.type == 'Run' && each.distance >= 20000)
        alldata = alldata.map((each)=>{
            return (1/each.average_speed*16.66667)
        })

        let sum = 0
        alldata.map((each)=>{
            sum+= each
        })

        if (sum == 0){
            return NaN
        }
        
        return parseFloat((sum/alldata.length).toFixed(1))

    } catch (error) {
        console.log(error)
    }
}

const time_10k = async (userID)=>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let alldata = stravaData.recentRuns
        
        alldata = alldata.filter(each => each.type == 'Run' && each.distance >= 10000 && each.distance < 20000)
        alldata = alldata.map((each)=>{
            return (1/each.average_speed*16.66667)
        })

        let sum = 0
        alldata.map((each)=>{
            sum+= each
        })

        if (sum == 0){
            return NaN
        }
        
        return parseFloat((sum/alldata.length).toFixed(1))

    } catch (error) {
        console.log(error)
    }
}

const time_5k = async (userID)=>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let alldata = stravaData.recentRuns
        
        alldata = alldata.filter(each => each.type == 'Run' && each.distance >= 5000 && each.distance < 10000)
        alldata = alldata.map((each)=>{
            return (1/each.average_speed*16.66667)
        })

        let sum = 0
        alldata.map((each)=>{
            sum+= each
        })

        if (sum == 0){
            throw NaN
        }
        
        return parseFloat((sum/alldata.length).toFixed(1))

    } catch (error) {
        console.log(error)
    }
}

const time_2k = async (userID)=>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let alldata = stravaData.recentRuns
        
        alldata = alldata.filter(each => each.type == 'Run' && each.distance >= 2000 && each.distance < 5000)
        alldata = alldata.map((each)=>{
            return (1/each.average_speed*16.66667)
        })

        let sum = 0
        alldata.map((each)=>{
            sum+= each
        })

        if (sum == 0){
            throw NaN
        }
        
        return parseFloat((sum/alldata.length).toFixed(1))

    } catch (error) {
        console.log(error)
    }
}

const getRegularScores = async (userID)=>{
    try {
        const time2k = await time_2k(userID)
        const time5k = await time_5k(userID)
        const time10k = await time_10k(userID)
        const time20k = await time_20k(userID)
        
        return({
            time2k: time2k,
            time5k: time5k,
            time10k: time10k,
            time20k: time20k
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = {getRegularScores}