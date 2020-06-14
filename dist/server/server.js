'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

// Set up mongoose connection
var mongoDB = process.env.MONGODB_URI;
_mongoose2.default.connect(mongoDB, { useNewUrlParser: true });
_mongoose2.default.Promise = global.Promise;
var db = _mongoose2.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api/v1/', _routes2.default);
app.get('/*', function (req, res) {
  res.send('Welcome');
});

app.listen(port);
console.log('App running on ' + port);