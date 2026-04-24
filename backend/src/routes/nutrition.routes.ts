import { Router } from 'express';
import {
  getMeals, createMeal, updateMeal, deleteMeal,
} from '../controllers/nutrition.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/',     getMeals);
router.post('/',    createMeal);
router.put('/:id',  updateMeal);
router.delete('/:id', deleteMeal);

export default router;
