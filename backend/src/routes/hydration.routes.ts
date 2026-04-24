import { Router } from 'express';
import {
  getToday, getGoal, updateGoal, addLog, deleteLog,
} from '../controllers/hydration.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/today',  getToday);
router.get('/goal',   getGoal);
router.put('/goal',   updateGoal);
router.post('/logs',  addLog);
router.delete('/logs/:id', deleteLog);

export default router;
