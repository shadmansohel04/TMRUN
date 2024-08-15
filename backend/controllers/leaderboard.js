const Strava =  require('../models/stravaData')
const User = require('../models/user')

const time20kArray = async() =>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.regularScores.time20k)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !Number.isNaN(each.score))

        allPeopleData.sort((a, b) => a.score - b.score);

        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}


const time10kArray = async() =>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.regularScores.time10k)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !Number.isNaN(each.score))

        allPeopleData.sort((a, b) => a.score - b.score);

        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}


const time5kArray = async() =>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.regularScores.time5k)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !Number.isNaN(each.score))

        allPeopleData.sort((a, b) => a.score - b.score);

        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}

const time2kArray = async() =>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.regularScores.time2k)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !Number.isNaN(each.score))

        allPeopleData.sort((a, b) => a.score - b.score);
        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}

const getMomentumArray = async()=>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.momentumScore)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !isNaN(each.score) && each.person !== null);

        allPeopleData.sort((a, b) => b.score - a.score);

        console.log(allPeopleData)

        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}

const getPacerArray = async ()=>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    score: parseFloat(each.scores.pacerScore)
                }
            })
        )

        allPeopleData = allPeopleData.filter(each => !isNaN(each.scores) && each.person !== null)

        allPeopleData.sort((a, b) => a.scores - b.scores);

        return allPeopleData
    } catch (error) {
        console.log(error)
    }
}

const getLeaderArray = async (req, res) => {
    try {
        let allPeopleData = await Strava.find({leaderboard: true});

        allPeopleData = await Promise.all(
            allPeopleData.map(async (each) => {
                const user = await User.findOne({ _id: each.person });
                const username = user ? user.username : null;
                return {
                    person: username,
                    scores: each.scores.elevationScore
                };
            })
        )

        allPeopleData = allPeopleData.filter(each => !isNaN(each.scores) && each.person !== null)

        allPeopleData.sort((a, b) => b.scores - a.scores);


        const consistentLeader = await consistentLeaderArray()
        const pacerLeader = await getPacerArray()
        const momentumArray = await getMomentumArray()
        const array2k = await time2kArray()
        const array5k = await time5kArray()
        const array10k = await time10kArray()
        const array20k = await time20kArray()

        return res.status(200).send({ 
            success: true, 
            allPeopleData, 
            consistentLeaderArray: consistentLeader, 
            pacerLeader: pacerLeader,
            momentumArray: momentumArray,
            array2k: array2k,
            array5k: array5k,
            array10k: array10k,
            array20k: array20k
        });

    } catch (error) {
        console.log(error);
        return res.status(200).send({ success: false, message: 'An error occurred' });
    }
};

const consistentLeaderArray = async() =>{
    try {
        let allPeopleData = await Strava.find({leaderboard: true})

        allPeopleData = await Promise.all(
            allPeopleData.map( async(each)=>{
                const user = await User.findOne({_id: each.person})
                const username = user.username
                return({
                    person: username,
                    score: each.scores.consistencyScore
                })

            })
        )

        allPeopleData = allPeopleData.filter(each => !Number.isNaN(each.score))

        return allPeopleData

    } catch (error) {
        console.log(error)
    }
}


module.exports = { getLeaderArray }