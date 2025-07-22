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
app.use(cors({
  origin:"https://tmrun-1.onrender.com"
}))

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

const pingWebsite = async () => {
  try {
    const response = await axios.get('https://rateto-backend.onrender.com/api/data?address=46.91310139948322+9.822978973388674&schoolChoice=private');
    const response2 = await axios.get('https://leetbotbackend.onrender.com/gettheScores');
    const response3 = await axios.get('https://hackthe6repo-ch8f.onrender.com/home/getRecipes');

    console.log(`Ping successful: ${response.status}`);
    console.log(`Ping2 successful: ${response2.status}`);
    console.log(`Ping3 successful: ${response3.status}`);
  } catch (error) {
    console.error(`Ping failed: ${error.message}`);
  }
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