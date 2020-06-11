import csv from 'csvtojson'
import iPhoneRequests from '../lib/iPhoneRequests'

var phoneName = ''
var iPhoneTradeRequestsArray = []

const fn = (data, iPhonesDetails) => {
  // return if its the title row
  if (data[1][1] === 'Storage Size') return
  if (data[0][1] !== '' && data[0][1] !== 'Unlocked') {
    // if (data[0][1] === 'Unlocked') {
    //   phone.status = data[0][1]
    //   return
    // } else {
    phoneName = data[0][1]
    return
  }
  if (data[2][1] === '') return

  iPhonesDetails.push({
    trade_type: data[0][0] === 'Buy Request' ? 'buy' : 'sell',
    name: phoneName,
    size: data[1][1],
    new: data[2][1],
    gradeA1: data[3][1],
    gradeA2: data[4][1],
    gradeB1: data[5][1],
    gradeB2: data[6][1],
    gradeC: data[7][1],
    gradeCB: data[8][1],
    gradeCD: data[9][1]
  })
}

export const loadIPhoneRequests = (req, res) => {
  csv()
  .fromFile('./iphones.csv')
  .then((jsonObj)=> {
    jsonObj.forEach(data => {
      // convert data to array
      const dataToArray = Object.entries(data)
  
      // split data into buy and sell
      const buyData = dataToArray.splice(0, 10)
      const sellData = dataToArray.splice(1, 11)
     
      fn(buyData, iPhoneTradeRequestsArray)
      fn(sellData, iPhoneTradeRequestsArray)
    })
  
    iPhoneRequests.insertMany(iPhoneTradeRequestsArray, (err, result) => {
      if (err) {
        res.status(500).send({ err })
      } else {
        return res.status(200).send({
          message: 'iPhone trade Requests loaded successfully',
        })
      }
    })
  })

}

export const getIPhoneRequests = (req, res) => {
  var page = parseInt(req.query.page)
  var size = parseInt(req.query.size)
  var query = {}

  if (page < 0 || page === 0) {
    response = {"error" : true,"message" : "invalid page number, should start with 1"}
    return res.json(response)
  }

  query.skip = size * (page - 1)
  query.limit = size

  iPhoneRequests.count({ trade_type: req.query.trade_type },function(err,totalCount) {
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"}
    }
    
    iPhoneRequests.find({ trade_type: req.query.trade_type }, {}, query, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Network error' })
      } else {
        const totalPages = Math.ceil(totalCount / size)

        return res.status(200).send({
          "iphone_requests" : result,
          "pages": totalPages
        })
      }
    })
  })
}
