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
  'https://rateto-backend.onrender.com/api/data?address=46.91310139948322+9.822978973388674&schoolChoice=private', 
  'https://livechatproject-410t.onrender.com/gettheScores', 
  'https://hackthe6repo-ch8f.onrender.com/home/getRecipes', 
  'https://tmrun-h224.onrender.com/userdash/home/66c3f36f5a2adf3a2f754e27/scores', 
  'https://foodskitest.onrender.com/profile/likedCards',
  "https://streakms-jni8.onrender.com/"
]

const pingWebsite = async () => {
  await Promise.all(
    webs.map(async (each) => {
      try {
        const response = await axios.get(each);
        console.log(`Success: ${each}`);
      } catch (error) {
        console.log(`Failed: ${each}`);
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