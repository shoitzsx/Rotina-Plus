import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as dashboardService from '../services/dashboard.service';

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await dashboardService.getDashboardSummary(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}
