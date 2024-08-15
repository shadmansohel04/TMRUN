require('dotenv').config();
require('express-async-errors');
const cors = require('cors')
const mainRouter = require('./routes/main')
const userRouter = require('./routes/user')
const {checkAuthorization} = require('./middleware/auth')

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
