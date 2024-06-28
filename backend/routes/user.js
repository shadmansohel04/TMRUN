const express = require('express')

const router = express.Router()
const{getUserInfo, switchLeader} = require('../controllers/userDash')
const {getAllScores} = require('../controllers/stravaAPI')
const {getLeaderArray} = require('../controllers/leaderboard')

router.route('/home/:id').get(getUserInfo)
router.route('/home/:id/scores').get(getAllScores)
router.route('/leader').get(getLeaderArray)
router.route('/home/switchLeader').post(switchLeader)

module.exports = router