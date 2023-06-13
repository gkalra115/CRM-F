// app.js
//var morgan = require('morgan');
const express = require('express');
var compression = require('compression')
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const jwt_decode = require('jwt-decode');
var cookieParser = require('cookie-parser');

var Notification = require('./models/notification');

//Routes of all the roles
const authRouter = require('./routes/auth');
const notificationRouter = require('./routes/notifications');
const apiroutes = require('./routes/api');
const superAdminRouter = require('./routes/superAdmin');
const adminRouter = require('./routes/admin');
const bdmRouter = require('./routes/bdm');
const managerRouter = require('./routes/manager');
const expertRouter = require('./routes/expert');
const teamleadRouter = require('./routes/teamlead');
const clientRouter = require('./routes/clients');
const { checkAuth, grantAccess } = require('./middleware/check-auth');

// initialize our express app
const app = express();

app.use(compression())

require('dotenv').config();
//app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
// Set up mongoose// mongodb://avek123:abcd1234@ds119765.mlab.com:19765/productstutorial// connection

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(async (req, res, next) => {
  if (
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.cookies.auth
  ) {
    let token =
      req.headers['x-access-token'] ||
      req.headers['authorization'] ||
      req.cookies.auth;
    if (!!token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }

    var decoded = jwt_decode(token);
    req.decoded =
      decoded.exp > Math.floor(new Date().getTime() / 1000)
        ? decoded
        : undefined;
    if (req.decoded !== undefined) {
      res.locals.name = req.decoded.name;
      res.locals.username = req.decoded.email;
      res.locals.userrole = req.decoded.userDetails.user_role;
      res.locals.userid = req.decoded.userId;
      res.locals.initialletter = req.decoded.email.charAt(0);
      res.locals.avatarinitial = req.decoded.email.charAt(0);
      res.locals.notifications = await Notification.find({
        actionEffectsToId: {
          $elemMatch: { _id: { $eq: req.decoded.userId }, flag: false },
        },
        actionTakenById: { $nin: [String(req.decoded.userId)] },
      }).countDocuments();
    }
    next();
  } else {
    return next();
  }
});

app.use(authRouter);
app.use(notificationRouter);
app.use(
  '/su',
  checkAuth,
  grantAccess('readAny', 'superadminview'),
  superAdminRouter
);
app.use('/ex', checkAuth, grantAccess('readAny', 'expertview'), expertRouter);
app.use('/ad', checkAuth, grantAccess('readAny', 'adminview'), adminRouter);
app.use('/bd', checkAuth, grantAccess('readAny', 'bdmview'), bdmRouter);
app.use(
  '/te',
  checkAuth,
  grantAccess('readAny', 'teamleadview'),
  teamleadRouter
);
app.use('/ma', checkAuth, grantAccess('readAny', 'managerview'), managerRouter);
app.use('/cl', checkAuth, grantAccess('readAny', 'clientview'), clientRouter);
app.use('/', apiroutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
