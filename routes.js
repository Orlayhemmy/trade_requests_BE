import express from 'express'
import {
  getIPhoneRequests,
  loadIPhoneRequests
} from './controllers/phones'

const router = express.Router()

router.route('/iphones-requests')
  .get(getIPhoneRequests)
  .post(loadIPhoneRequests)

export default router
