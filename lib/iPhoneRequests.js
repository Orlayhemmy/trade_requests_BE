import mongoose from 'mongoose'

const iPhoneRequestSchema = new mongoose.Schema({
  trade_type: { type: String },
  name: { type: String },
  size: { type: String },
  new: { type: String },
  gradeA1: { type: String },
  gradeA2: { type: String },
  gradeB1: { type: String },
  gradeB2: { type: String },
  gradeC: { type: String },
  gradeCB: { type: String },
  gradeCD: { type: String },
})

const iPhoneRequests = mongoose.model('iphones', iPhoneRequestSchema)

export default iPhoneRequests
