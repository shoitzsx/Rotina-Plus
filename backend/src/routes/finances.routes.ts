import { Router } from 'express';
import {
  getTransactions, createTransaction, updateTransaction, deleteTransaction,
  getCategories, createCategory, deleteCategory,
  getMonthlySummary,
} from '../controllers/finances.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/transactions',       getTransactions);
router.post('/transactions',      createTransaction);
router.put('/transactions/:id',   updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

router.get('/categories',       getCategories);
router.post('/categories',      createCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/summary', getMonthlySummary);

export default router;
