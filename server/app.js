const express = require('express')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/error')

app.use(cors({
    origin: "https://codefusion-silk.vercel.app"
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//Route Imports
const user = require('./routes/userRoute');
const quiz = require('./routes/quizRoute');
const result = require('./routes/resultRoute')


app.use('/api/v1', user);
app.use('/api/v1', quiz);
app.use('/api/v1', result)

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app;