const express = require('express');
const app = express();
require('dotenv').config();
const dB = require('./config/database');
const validator = require('validator');
const cors = require('cors')
var cookieParser = require('cookie-parser');

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());



const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user')

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
});

