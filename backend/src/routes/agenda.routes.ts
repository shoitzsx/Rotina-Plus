import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/agenda.controller';
import { devMiddleware } from '../middlewares/dev.middleware';
// import { authMiddleware } from '../middlewares/auth.middleware'; // ← trocar quando implementar auth

const router = Router();
router.use(devMiddleware);

router.get('/',       getEvents);
router.get('/:id',    getEvent);
router.post('/',      createEvent);
router.put('/:id',    updateEvent);
router.delete('/:id', deleteEvent);

export default router;
