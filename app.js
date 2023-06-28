const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '649c26404372dddcd665594d',
  };

  next();
});

app.listen(PORT);
