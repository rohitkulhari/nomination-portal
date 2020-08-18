const express = require('express');
const compression = require('compression');
const authcontroller = require('./controllers/auth-controller');
const error = require('./controllers/error');
const path = require('path');
const ratelimiter = require('express-rate-limit');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const apierror = require('./util/global-error');
const cookie_parser = require('cookie-parser');
const candidate_router = require('./router/candidate-router.js');
const view_router = require('./router/view-router');
const cors = require('cors');
const app = express();
app.use(compression());
///////////////////////////////////////////
const limiter = ratelimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request',
});
app.use(cors());
/////////////////////////////////////////////////
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookie_parser());
app.use(mongosanitize());
app.use(xss());
app.use(helmet());
app.use(
  hpp({
    whitelist: ['name', 'email', 'post'],
  })
);
app.use('/', view_router);
app.use('/api', limiter);
//////////////////////////////////////////////////
app.use('/api/v1/candidate', candidate_router);
app.all('*', (req, res, next) => {
  return next(new apierror('invalid api request', 400));
});
app.use(error);
module.exports = app;
