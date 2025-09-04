require('dotenv').config();
require('express-async-errors');
const cors = require('cors')
const mainRouter = require('./routes/main')
const userRouter = require('./routes/user')
const {checkAuthorization} = require('./middleware/auth')
const axios = require('axios');


const express = require('express');
const app = express();
const connectDB = require('./db/connect')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// PRODUCTION
app.use(cors())

// DEV
// app.use(cors({
//   origin:"http://localhost:5173"
// }))

app.use(express.json())

app.use('/home', mainRouter)
app.use('/userdash', checkAuthorization, userRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const webs = [
  {url:'https://rateto-backend.onrender.com/api/data?address=46.91310139948322+9.822978973388674&schoolChoice=private', method: "GET"}, 
  {url:'https://livechatproject-410t.onrender.com/gettheScores', method: "GET"},
  {url:'https://hackthe6repo-ch8f.onrender.com/home/forSpinUp', method: "GET"},
  {url:'https://tmrun-h224.onrender.com/home/login', method:"POST", body:{email: "somethingSilly@gmail.com", password:"wouldnt you like to know"}},
  {url: 'https://foodskitest.onrender.com/recipe/ParseRecipe', method: "POST", body: {Recipe: "Mix in the avocado with the milk"}},
  {url:"https://streakms-jni8.onrender.com/schedule/", method: "GET"}
]

const pingWebsite = async () => {
  await Promise.all(
    webs.map(async (each) => {
      try {
        let response
        if(each.method == "GET"){
          response = await axios.get(each.url);
          console.log(`Success: ${each.url}: ${response.status}`);
        }
        else if (each.method == "POST"){
          response = await axios.post(each.url, each.body);
          console.log(`Success: ${each.url}: ${response.status}`);
        }

      } catch (error) {
        console.log(`Failed: ${each.url}: ${error}`);
      }
    })
  );
};


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

setInterval(pingWebsite, 120000);