import mongoose from 'mongoose'

const PhoneRequestSchema = new mongoose.Schema({
  trade_type: { type: String },
  name: { type: String },
  size: { type: String },
  status: { type: String },
  grade: { type: String },
  price: { type: Number }
})
PhoneRequestSchema.index({ name: 'text', size: 'text', status: 'text', grade: 'text'  });
const PhoneRequests = mongoose.model('iphones', PhoneRequestSchema)

export default PhoneRequests
