import { Router } from 'express';
import authRoutes      from './auth.routes';
import agendaRoutes    from './agenda.routes';
import studiesRoutes   from './studies.routes';
import financesRoutes  from './finances.routes';
import hydrationRoutes from './hydration.routes';
import nutritionRoutes from './nutrition.routes';
import habitsRoutes    from './habits.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth',      authRoutes);
router.use('/agenda',    agendaRoutes);
router.use('/studies',   studiesRoutes);
router.use('/finances',  financesRoutes);
router.use('/hydration', hydrationRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/habits',    habitsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
