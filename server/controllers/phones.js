import csv from 'csvtojson'
import iPhoneRequests from '../lib/iPhoneRequests'

let phoneName = ''
let iPhoneTradeRequestsArray = []
let iPhoneGrades = []
let iPhoneStatus = ''

const formatSpreadsheetData = (data, iPhonesDetails) => {
  // return if its the title row
  if (data[1][1] === 'Storage Size') {
    iPhoneGrades = data
    return
  }
  if (data[0][1] !== '') {
    const statusToLowerCase = data[0][1].toLowerCase()

    if (statusToLowerCase === 'unlocked' || statusToLowerCase === 'locked') {
      iPhoneStatus = data[0][1].toLowerCase()
    } else {
      phoneName = data[0][1].toLowerCase()
      return
    }
  }
  if (data[2][1] === '') return

  let i = 2;
  while (i < 10) { 
    iPhonesDetails.push({
      trade_type: data[0][0] === 'Buy Request' ? 'buy' : 'sell',
      name: phoneName,
      size: data[1][1].toLowerCase(),
      status: iPhoneStatus.toLowerCase(),
      grade: iPhoneGrades[i][1].toLowerCase(),
      price: parseInt(data[i][1].substr(1).replace(/,/g, ''))
    })
    i++
  }
}

export const loadIPhoneRequests = (req, res) => {
  csv()
  .fromFile('../iphones.csv')
  .then((jsonObj)=> {
    jsonObj.forEach(data => {
      // convert data to array
      const dataToArray = Object.entries(data)
  
      // split data into buy and sell
      const buyData = dataToArray.splice(0, 10)
      const sellData = dataToArray.splice(1, 11)
     
      formatSpreadsheetData(buyData, iPhoneTradeRequestsArray)
      formatSpreadsheetData(sellData, iPhoneTradeRequestsArray)
    })
  
    iPhoneRequests.insertMany(iPhoneTradeRequestsArray, (err, result) => {
      if (err) {
        res.status(500).send({ err })
      } else {
        return res.status(200).send({
          message: 'Trade Request loaded successfully',
        })
      }
    })
  })

}

export const getIPhoneRequests = ({ query: { page, page_size, trade_type, search_text, grade, size, name, price }}, res) => {
  const pageNum = parseInt(page || 1)
  const pageSize = parseInt(page_size)
  const query = {}
  let response
  const filterObject = {}
  const parsedPrice = price && price.trim() != 'undefined' ? JSON.parse(price) : []
  const parsedSize = size && size.trim() != 'undefined' ? JSON.parse(size) : []
  const parsedName = name && name.trim() != 'undefined' ? JSON.parse(name) : []
  const parsedGrade = grade && grade.trim() != 'undefined' ? JSON.parse(grade) : []

  if (trade_type) filterObject['trade_type'] = trade_type
  if (parsedGrade && parsedGrade.length) filterObject['grade'] = { $in: parsedGrade }
  if (parsedSize && parsedSize.length) filterObject['size'] = { $in: parsedSize }
  if (parsedName && parsedName.length) filterObject['name'] = { $in: parsedName }
  if (parsedPrice && parsedPrice.length) filterObject['price'] = { $gt: parsedPrice[0], $lt: parsedPrice[1] }

  if (pageNum < 0 || pageNum === 0) {
    response = {"error" : true,"message" : "invalid page number, should start with 1"}
    return res.json(response)
  }

  query.skip = pageSize * (pageNum - 1)
  query.limit = pageSize

  const requestType = search_text && search_text.trim() != 'undefined'
    ? { $text: { $search: search_text } }
    : filterObject
  
  iPhoneRequests.count(requestType, function(err,totalCount) {
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"}
    }
    
    iPhoneRequests.find(requestType, {}, query, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error fetching data' })
      } else {
        const totalPages = Math.ceil(totalCount / pageSize)
        response = {
          "phone_requests" : result,
          "meta": {
            totalPages,
            currentPage: pageNum
          }
        }
        return res.status(200).send(response)
      }
    })
  })
}
