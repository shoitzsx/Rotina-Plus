import { Router } from 'express';
import {
  getSubjects, createSubject, updateSubject, deleteSubject,
  getSessions, createSession, deleteSession,
} from '../controllers/studies.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/subjects',       getSubjects);
router.post('/subjects',      createSubject);
router.put('/subjects/:id',   updateSubject);
router.delete('/subjects/:id', deleteSubject);

router.get('/sessions',       getSessions);
router.post('/sessions',      createSession);
router.delete('/sessions/:id', deleteSession);

export default router;
