const express = require('express')

const router = express.Router()

const {homeGet, aboutGet, sendContact} = require('../controllers/main')
const {signUp, login, confirmEmail} = require('../controllers/auth')
const {onLink} = require('../controllers/stravaAPI')


router.route('/about').get(aboutGet)
router.route('/sign_up').post(signUp)
router.route('/login').post(login)
router.route('/confirmation/:token').get(confirmEmail)
router.route('/STRAVALINK').get(onLink)
router.route('/contact').post(sendContact)

module.exports = router