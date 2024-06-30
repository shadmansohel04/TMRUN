const Strava = require('../models/stravaData')

const calculateTime = (runs, minDistance, maxDistance) => {
    let filteredRuns = runs
        .filter(each => each.type === "Run" && each.distance >= minDistance && each.distance < maxDistance)
        .map(each => (1 / each.average_speed) * 16.66667);

    if (filteredRuns.length === 0) {
        return 0; 
    }

    let sum = filteredRuns.reduce((acc, each) => acc + each, 0);
    return parseFloat((sum / filteredRuns.length).toFixed(1));
}

const time_10k = async (userID) => {
    try {
        const stravaData = await Strava.findOne({ person: userID });
        return calculateTime(stravaData.recentRuns, 10000, Infinity);
    } catch (error) {
        console.log(error);
        throw error
    }
}

const time_5k = async (userID) => {
    try {
        const stravaData = await Strava.findOne({ person: userID });
        return calculateTime(stravaData.recentRuns, 5000, 10000);
    } catch (error) {
        console.log(error);
        throw error
    }
}

const time_2k = async (userID) => {
    try {
        const stravaData = await Strava.findOne({ person: userID });
        return calculateTime(stravaData.recentRuns, 2000, 5000);
    } catch (error) {
        console.log(error);
        throw error; 
    }
}

const getRegularScores = async (userID) => {
    try {
        const time2k = await time_2k(userID);
        const time5k = await time_5k(userID);
        const time10k = await time_10k(userID);

        return {
            time2k: time2k,
            time5k: time5k,
            time10k: time10k
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { getRegularScores }
