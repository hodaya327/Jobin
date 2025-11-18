import express from 'express';
import * as eventController from '../controllers/eventController.js';
// import { authenticateToken, isAdmin, isEventManager, requireIdentity } from '../middleware/token.js';
import {
  validateCreateEvent,

} from '../middleware/eventValidator.js';

const router = express.Router();

router.post('/analyze', authenticateToken, validateCreateEvent, eventController.createEvent);

export default router;