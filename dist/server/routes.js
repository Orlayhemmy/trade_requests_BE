'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _phones = require('./controllers/phones');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.route('/iphones-requests').get(_phones.getIPhoneRequests).post(_phones.loadIPhoneRequests);

exports.default = router;