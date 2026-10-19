import { Router } from 'express';
import { bookingManager } from '../managers/instances.js';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    res.status(201).json(bookingManager.createBooking(req.body));
  } catch (error) {
    next(error);
  }
});

router.get('/:bid', (req, res, next) => {
  try {
    res.status(200).json(bookingManager.getBookingById(req.params.bid));
  } catch (error) {
    next(error);
  }
});

router.post('/:bid/services/:sid', (req, res, next) => {
  try {
    const { bid, sid } = req.params;
    res.status(200).json(bookingManager.addServiceToBooking(bid, sid));
  } catch (error) {
    next(error);
  }
});

export default router;