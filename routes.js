import express from 'express'
import {
  getPhoneRequests,
  loadPhoneRequests,
  searchPhoneRequests
} from './controllers/phones'

const router = express.Router()

router.route('/phones-requests')
  .get(getPhoneRequests)
  .post(loadPhoneRequests)

router.route('/search-phones')
  .get(searchPhoneRequests)

export default router
