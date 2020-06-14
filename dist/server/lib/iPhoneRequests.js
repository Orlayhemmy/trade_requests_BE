'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var iPhoneRequestSchema = new _mongoose2.default.Schema({
  trade_type: { type: String },
  name: { type: String },
  size: { type: String },
  status: { type: String },
  grade: { type: String },
  price: { type: Number }
});
iPhoneRequestSchema.index({ name: 'text', size: 'text', status: 'text', grade: 'text' });
var iPhoneRequests = _mongoose2.default.model('iphones', iPhoneRequestSchema);

exports.default = iPhoneRequests;