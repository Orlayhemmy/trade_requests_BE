import express from 'express'
import {
  getPhoneRequests,
  loadPhoneRequests
} from './controllers/phones'

const router = express.Router()

router.route('/phones-requests')
  .get(getPhoneRequests)
  .post(loadPhoneRequests)

export default router
