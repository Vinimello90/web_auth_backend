require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const passkeysRouter = require('./routes/passkeys');
const NotFoundError = require('./utils/errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const sessionHandler = require('./middlewares/sessionHandler');

const { API_PORT, DATABASE_URL } = process.env;
const ALLOWED_ORIGINS = process.env.ORIGINS.split(',');

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connection established'))
  .catch(() => console.error('Failed to connect to MongoDB'));

const app = express();

app.set('trust proxy', 1);

const { PORT = API_PORT } = process.env;

app.use(express.json());

app.use(requestLogger);

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

app.options('*', cors());

app.use(sessionHandler);

app.use('/passkeys', passkeysRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('The request was not found.'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
  });
}

module.exports = app;
