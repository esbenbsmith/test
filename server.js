var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Log = require('./models/log'),
    User = require('./models/user'),
    session = require('express-session');

    mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/fun-around-us' // plug in the db name you've been using
);

// connect to mongodb
mongoose.connect('mongodb://localhost/gigs_around_me');

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req// require mongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define log schema
var LogSchema = new Schema({
  type: String,
  calories: Number
});

// create and export Log model
var Log = mongoose.model('Log', LogSchema);
module.exports = Log;user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// STATIC ROUTES
app.use(express.static(__dirname + '/public'));

// root route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// USER ROUTES

// create new user with secure password
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  User.createSecure(newUser, function (err, user) {
    // log in user immediately when created
    req.login(user);
    res.redirect('/profile');
  });
});

// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.email, userData.password, function (err, user) {
    req.login(user);
    res.redirect('/profile');
  });
});

// profile page
app.get('/profile', function (req, res) {
  req.currentUser(function (err, user) {
    res.sendFile(__dirname + '/public/views/profile.html');
  });
});

// API ROUTES

// show all logs
app.get('/api/logs', function (req, res) {
  Log.find(function (err, logs) {
    res.json(logs);
  });
});

// create new log
app.post('/api/logs', function (req, res) {
  // create new instance of Log
  var newLog = new Log({
    type: req.body.type,
    calories: req.body.calories
  });

  // save new log in db
  newLog.save(function (err, savedLog) {
    res.json(savedLog);
  });
});






// listen on port 3000
app.listen(process.env.PORT || 3000);
