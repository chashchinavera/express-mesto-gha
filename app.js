const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/index');
const cardRouter = require('./routes/index');
const error = require('./middlewares/error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(userRouter);
app.use(cardRouter);

app.use(errors());
app.use(error);

app.listen(PORT);
