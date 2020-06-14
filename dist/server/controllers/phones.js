'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIPhoneRequests = exports.loadIPhoneRequests = undefined;

var _csvtojson = require('csvtojson');

var _csvtojson2 = _interopRequireDefault(_csvtojson);

var _iPhoneRequests = require('../lib/iPhoneRequests');

var _iPhoneRequests2 = _interopRequireDefault(_iPhoneRequests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var phoneName = '';
var iPhoneTradeRequestsArray = [];
var iPhoneGrades = [];
var iPhoneStatus = '';

var formatSpreadsheetData = function formatSpreadsheetData(data, iPhonesDetails) {
  // return if its the title row
  if (data[1][1] === 'Storage Size') {
    iPhoneGrades = data;
    return;
  }
  if (data[0][1] !== '') {
    var statusToLowerCase = data[0][1].toLowerCase();

    if (statusToLowerCase === 'unlocked' || statusToLowerCase === 'locked') {
      iPhoneStatus = data[0][1].toLowerCase();
    } else {
      phoneName = data[0][1].toLowerCase();
      return;
    }
  }
  if (data[2][1] === '') return;

  var i = 2;
  while (i < 10) {
    iPhonesDetails.push({
      trade_type: data[0][0] === 'Buy Request' ? 'buy' : 'sell',
      name: phoneName,
      size: data[1][1].toLowerCase(),
      status: iPhoneStatus.toLowerCase(),
      grade: iPhoneGrades[i][1].toLowerCase(),
      price: parseInt(data[i][1].substr(1).replace(/,/g, ''))
    });
    i++;
  }
};

var loadIPhoneRequests = exports.loadIPhoneRequests = function loadIPhoneRequests(req, res) {
  (0, _csvtojson2.default)().fromFile('./iphones.csv').then(function (jsonObj) {
    jsonObj.forEach(function (data) {
      // convert data to array
      var dataToArray = Object.entries(data);

      // split data into buy and sell
      var buyData = dataToArray.splice(0, 10);
      var sellData = dataToArray.splice(1, 11);

      formatSpreadsheetData(buyData, iPhoneTradeRequestsArray);
      formatSpreadsheetData(sellData, iPhoneTradeRequestsArray);
    });

    _iPhoneRequests2.default.insertMany(iPhoneTradeRequestsArray, function (err, result) {
      if (err) {
        res.status(500).send({ err: err });
      } else {
        return res.status(200).send({
          message: 'Trade Request loaded successfully'
        });
      }
    });
  });
};

var getIPhoneRequests = exports.getIPhoneRequests = function getIPhoneRequests(_ref, res) {
  var _ref$query = _ref.query,
      page = _ref$query.page,
      page_size = _ref$query.page_size,
      trade_type = _ref$query.trade_type,
      search_text = _ref$query.search_text,
      grade = _ref$query.grade,
      size = _ref$query.size,
      name = _ref$query.name,
      price = _ref$query.price;

  var pageNum = parseInt(page || 1);
  var pageSize = parseInt(page_size);
  var query = {};
  var response = void 0;
  var filterObject = {};
  var parsedPrice = price && price.trim() != 'undefined' ? JSON.parse(price) : [];
  var parsedSize = size && size.trim() != 'undefined' ? JSON.parse(size) : [];
  var parsedName = name && name.trim() != 'undefined' ? JSON.parse(name) : [];
  var parsedGrade = grade && grade.trim() != 'undefined' ? JSON.parse(grade) : [];

  if (trade_type) filterObject['trade_type'] = trade_type;
  if (parsedGrade && parsedGrade.length) filterObject['grade'] = { $in: parsedGrade };
  if (parsedSize && parsedSize.length) filterObject['size'] = { $in: parsedSize };
  if (parsedName && parsedName.length) filterObject['name'] = { $in: parsedName };
  if (parsedPrice && parsedPrice.length) filterObject['price'] = { $gt: parsedPrice[0], $lt: parsedPrice[1] };

  if (pageNum < 0 || pageNum === 0) {
    response = { "error": true, "message": "invalid page number, should start with 1" };
    return res.json(response);
  }

  query.skip = pageSize * (pageNum - 1);
  query.limit = pageSize;

  var requestType = search_text && search_text.trim() != 'undefined' ? { $text: { $search: search_text } } : filterObject;

  _iPhoneRequests2.default.count(requestType, function (err, totalCount) {
    if (err) {
      response = { "error": true, "message": "Error fetching data" };
    }

    _iPhoneRequests2.default.find(requestType, {}, query, function (err, result) {
      if (err) {
        return res.status(500).send({ message: 'Error fetching data' });
      } else {
        var totalPages = Math.ceil(totalCount / pageSize);
        response = {
          "phone_requests": result,
          "meta": {
            totalPages: totalPages,
            currentPage: pageNum
          }
        };
        return res.status(200).send(response);
      }
    });
  });
};