import mongoose from 'mongoose'

const iPhoneRequestSchema = new mongoose.Schema({
  trade_type: { type: String },
  name: { type: String },
  size: { type: String },
  status: { type: String },
  grade: { type: String },
  price: { type: Number }
})
iPhoneRequestSchema.index({ name: 'text', size: 'text', status: 'text', grade: 'text'  });
const iPhoneRequests = mongoose.model('iphones', iPhoneRequestSchema)

export default iPhoneRequests
