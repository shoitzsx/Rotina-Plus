import { Router } from 'express';
import {
  getHabits, createHabit, updateHabit, deleteHabit,
  getTodayHabits, completeHabit, uncompleteHabit,
} from '../controllers/habits.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/today',             getTodayHabits);
router.get('/',                  getHabits);
router.post('/',                 createHabit);
router.put('/:id',               updateHabit);
router.delete('/:id',            deleteHabit);
router.post('/:id/complete',     completeHabit);
router.delete('/:id/complete',   uncompleteHabit);

export default router;
