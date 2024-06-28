const axios = require('axios');
const User = require('../models/user')
const Strava = require('../models/stravaData')
const jwt = require('jsonwebtoken');
const {getRegularScores} = require('../controllers/regularScores')

const mealBurn = async (userID)=>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let lastThreeRuns = stravaData.lastThreeRuns
        lastThreeRuns = lastThreeRuns.map((each)=>{
            if(each.distance >= 2000 && each.type == "Run"){
                return each.calories
            }
        })
        const size = lastThreeRuns.length
        
        lastThreeRuns = lastThreeRuns.filter((each) => {
            return each.calories >= 500;
        });        
        

        return(lastThreeRuns.length/ size * 100).toFixed(1)



    } catch (error) {
        console.log(error)
    }
}

const improver = async (userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let recentRuns = stravaData.recentRuns
        let RecentDistance = recentRuns[0].distance
        let min = 2000
        if(RecentDistance > 5000){
            min = 5000
        }
        else if (RecentDistance > 10000){
            min = 10000
        }
        else{
            min = 20000
        }

        let recentPace = recentRuns[0].average_speed

        recentRuns = recentRuns.filter(each => each.distance >= 2000 && each.type == "Run")

        const FirstRun = recentRuns[recentRuns.length -1].average_speed
        
        return (((recentPace - FirstRun)/ FirstRun)*100).toFixed(1)

    } catch (error) {
        console.log(error)
    }
}

const momentum = async (userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        const weight = stravaData.weight
        let recentRuns = stravaData.recentRuns
        recentRuns = recentRuns.map((each)=>{
            if(each.type == "Run" && each.distance >= 2000){
                return each.max_speed
            }
        })

        let sum = 0
        recentRuns.map((each)=>{
            sum += each
        })
        sum = sum / recentRuns.length
        sum = sum * weight

        return sum.toFixed(1)
    } catch (error) {
        console.log(error)
    }
}

const pacer = async (userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let lastThreeRuns = stravaData.lastThreeRuns
        lastThreeRuns = lastThreeRuns.map((each)=>{
            if(each.type == "Run" && each.distance >= 2000){
                return each.splits_metric
            }
        })

        lastThreeRuns = lastThreeRuns.map((each)=>{
            each = each.map((item)=>{
                return (1/(item.average_speed)*16.6666666667)
            })
            return each
        })

        lastThreeRuns = lastThreeRuns.map((each)=>{
            return(Math.max(...each) - Math.min(...each))
        })
        let sum = 0

        lastThreeRuns.map((each)=>{
            sum += each
        })

        sum = sum/ lastThreeRuns.length

        return sum.toFixed(1)

    } catch (error) {  
        console.log(error)
    }
}

const timePusher = async (userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let threeRuns = stravaData.lastThreeRuns
        threeRuns = threeRuns.map((each)=>{
            if(each.type == "Run" && each.distance >= 2000){
                return(each.splits_metric)
            }
        })

        let indexs = []
                
        threeRuns = threeRuns.map((each)=>{
            each = each.map((item)=>{
                return(item.average_speed)
            })
            return each
        })

        threeRuns.map((each)=>{
            const max = Math.max(...each)
            each.map((item, index)=>{
                if(item == max){
                    indexs.push({index: index, size: each.length})
                }
            })
        })

        let average = {
            before: 0,
            after: 0
        }

        indexs.map((each) =>{
            if( (each.index + 1) < each.size/2 ){
                average.before += 1
            }
            else{
                average.after += 1
            }
        })


        let score = {
            time: "",
            value: ""
        }

        if(average.before > average.after){
            score.time = "Early Pusher",
            score.value = (average.before / (average.before + average.after) * 100).toFixed(0)
        }
        else if(average.after > average.before){
            score.time = "Late Finisher",
            score.value = (average.after / (average.before + average.after) * 100).toFixed(0)
        }
        else{
            score.time = "Day To Day Pusher"
            score.value = 50
        }

        return score

    } catch (error) {
        console.log(error)
    }
}

const getAMorPMscore = async (userID) =>{
    try {
        const userData = await Strava.findOne({person: userID})
        let data = userData.recentRuns
        let am = 0
        let pm = 0

        data.map((each) =>{
            let date = new Date(each.start_date_local)
            if(each.type == "Run" && date.getHours() >= 17){
                return pm += 1
            }
            return am += 1
        })
        if(am > pm){
            return ((am/(am+pm))*-100).toFixed(0)   
        }
        else if(pm > am){
            return ((pm/(am+pm))*100).toFixed(0)   
        }
        return 0

    } catch (error) {
        console.log(error)
    }
}

const getlastThreeRunsData = async (userID, accessToken) =>{
    try {
        const userData = await Strava.findOne({person: userID})
        let tempData = userData.recentRuns
        let index = 3
        if(tempData.length < 3){
            index = tempData.length
        }
        let runIDs = []
        for(let i = 0; i < index; i++ ){
            runIDs.push(tempData[i].id)
        }
        let lastRuns = []
        for(let i = 0; i < index; i ++){
            const response = await axios.get(`https://www.strava.com/api/v3/activities/${runIDs[i]}`,{
                params:{
                    include_all_efforts: true,
                    access_token: accessToken
                }
            })
            lastRuns.push(response.data)
        }
        userData.lastThreeRuns = lastRuns
        userData.save()
    } catch (error) {
        console.log(error)
    }
}

const highClimber = async (userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let totalElevation = 0
        let alldata = stravaData.recentRuns
        alldata = alldata.map((each) => {
            if(each.type == "Run" && each.distance >= 2000){
                totalElevation += each.total_elevation_gain
                return(
                    each.total_elevation_gain
                )
            }
        })

        const avgElevation = totalElevation/ alldata.length
        return avgElevation
        
    } catch (error) {
        
    }
}

const CaptainConsistency = async (userID) =>{

    function isWithin30Days(stravaDateString) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
    
        let stravaDate = new Date(stravaDateString);
        stravaDate.setHours(0, 0, 0, 0);
    
        let thirtyDaysAfterStrava = new Date(stravaDate);
        thirtyDaysAfterStrava.setDate(thirtyDaysAfterStrava.getDate() + 30);
    
        return today <= thirtyDaysAfterStrava;
    }

    try {
        let stravaData = await Strava.findOne({person: userID})
        stravaData = stravaData.recentRuns
        let numberOfRuns = 0
        stravaData = stravaData.map((each)=>{
            if(each.type == "Run"){
                return(each.start_date)
            }        
        })

        stravaData.map((each)=>{
            if(isWithin30Days(each)){
                numberOfRuns += 1
            }
        })
        return numberOfRuns*3.3.toFixed(1) 
    } catch (error) {
        console.log(error)
    }
}

const getAccessToken = async (userID) =>{
    try {
        const user = await User.findOne({_id: userID})
        const refresh_token = user.user_code
        const response = await axios.post("https://www.strava.com/oauth/token", null, {
            params:{
                client_id: 128690,
                client_secret: process.env.STRAVA_SECRET,
                refresh_token: refresh_token,
                grant_type: "refresh_token"
            }
        })
        return response.data.access_token
    } catch (error) {
        console.log(error)
    }
}

const updateStrava = async (userID)=>{
    try {
        const access_token = await getAccessToken(userID)
        const response = await axios.get("https://www.strava.com/api/v3/activities", {
            params:{
                access_token: access_token
            }
        })

        const weightResponse = await axios.get("https://www.strava.com/api/v3/athlete",{
            params:{
                access_token: access_token
            }
        })

        let weight = weightResponse.data.weight
        const stravaData = await Strava.findOne({person: userID})
        stravaData.recentRuns = response.data
        stravaData.weight = weight
        await getlastThreeRunsData(userID, access_token)
        await updateScores(userID)
        await stravaData.save()
        return
    } catch (error) {
        console.log(error)
    }
}

const getRecentRuns = async(userID) =>{
    try {
        const stravaData = await Strava.findOne({person: userID})
        let data = stravaData.recentRuns
        data = data.map((prev, index) =>{
            const each = data[index]
            if(each.type == "Run"){
                return({
                    time: (each.elapsed_time/60).toFixed(1),
                    distance: (each.distance/1000).toFixed(1)
                })
            }
        })

        const scores = stravaData.scores

        return {data, scores}
        
    } catch (error) {
        console.log(error)
    }
}

const getAllScores = async (req, res) =>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(200).send({success: false, msg: "couldnt find you"})
        }
        const stravaPerson = await Strava.findOne({person: id})
        const elevationScore = stravaPerson.scores.elevationScore
        const consistencyScore = stravaPerson.scores.consistencyScore
        const amPMscore = stravaPerson.scores.amORpmScore
        const timePusherScore = stravaPerson.scores.timePusherScore
        const momentumScore = stravaPerson.scores.momentumScore
        const pacerScore = stravaPerson.scores.pacerScore
        const leaderboard = stravaPerson.leaderboard
        const leaderMSG = leaderboard == true ? "Leave The Leaderboard": "Join The Leaderboard"
        const regular_scores = stravaPerson.scores.regularScores
        const improvement = stravaPerson.scores.improve
        const calories = stravaPerson.scores.calories

        return res.status(200).send(
            {
                success: true, 
                elevationScore: elevationScore, 
                consistencyScore: consistencyScore, 
                AM_PM_score: amPMscore,
                timePusher: timePusherScore,
                pacerScore: pacerScore,
                leaderMSG: leaderMSG,
                momentumScore: momentumScore,
                regularScores: regular_scores,
                improvement: improvement,
                calories: calories
            }
        )
   
    } catch (error) {
        console.log(error)   
    }
}

const updateScores = async(id)=>{
    try {

        const elevationScore = await highClimber(id)
        const timePusherScore = await timePusher(id)
        const consistencyScore = await CaptainConsistency(id)
        const pacerScore = await pacer(id)
        const momentumScore = await momentum(id)
        const AMPM = await getAMorPMscore(id)
        const regularScores = await getRegularScores(id)
        const improve = await improver(id)
        const calories = await mealBurn(id)
        
        let amPMscore = {
            time: "",
            score: 0
        }

        if(AMPM > 0){
            amPMscore.time = "PM"
            amPMscore.score = AMPM
        }
        else if(AMPM < 0){
            amPMscore.time = "AM"
            amPMscore.score = -AMPM
        }
        else{
            amPMscore.time = "EVEN"
            amPMscore.score = AMPM
        }

        const stravaPerson = await Strava.findOne({person: id})
        stravaPerson.scores = {
            elevationScore: elevationScore,
            timePusherScore: timePusherScore,
            consistencyScore: consistencyScore,
            amORpmScore: amPMscore,
            pacerScore: pacerScore,
            momentumScore: momentumScore,
            regularScores: regularScores,
            improve: improve,
            calories: calories
        }
        stravaPerson.save()

    } catch (error) {
        console.log(error)
    }
}

const onLink = async (req, res) => {
    try {
        const code = req.query.code;
        const user_id = req.query.user_id
        const response = await axios.post('https://www.strava.com/oauth/token', null, {
            params: {
                client_id: 128690,
                client_secret: "0a4eb28870dd322cacc0ba87621139952f043ab0",
                code: code,
                grant_type: "authorization_code",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYWQiLCJpZCI6MzEsImlhdCI6MTcxNzIwMTk2OCwiZXhwIjoxNzE5NzkzOTY4fQ.yblRS1e8txT_xRHBZjWmhqlFRfBLkatZOrDhjr3dLSc"
            }
        });
        const refresh_token = response.data.refresh_token
        const stravaID = response.data.athlete.id
        const user = await User.findOne({_id: user_id})
        const stravaData = await Strava.findOne({person: user_id})
        stravaData.stravaID = stravaID
        user.user_code = refresh_token
        await user.save()
        await stravaData.save()
        await updateStrava(user_id)
        res.status(200).send(`<h1>Strava connected!</h1>` + `<a href="http://localhost:5173/login">Login</a>`)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, error: error.message });
    }
};

module.exports = { onLink, getAccessToken, updateStrava, getRecentRuns, getAllScores };
