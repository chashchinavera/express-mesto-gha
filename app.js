const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { errors } = require('celebrate');
const error = require('./middlewares/error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(errors());

app.use(cardRouter);

app.listen(PORT);
