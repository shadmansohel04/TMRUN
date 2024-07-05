const User = require('./backend/models/user')
const axios = require('axios')

async function maker(access_token){
    try {
        const response = await axios.get("https://www.strava.com/api/v3/activities", {
            params:{
                access_token: access_token
            }
        })

        console.log(response.data)
    } catch (error) {
        console.log(error)
    }

}

maker("245138ac419c9b4f62ed49f9882773da4ab9f543")