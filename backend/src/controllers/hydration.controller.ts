import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as hydrationService from '../services/hydration.service';

export async function getToday(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await hydrationService.getTodaySummary(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getGoal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await hydrationService.getGoal(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateGoal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await hydrationService.updateGoal(req.userId!, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function addLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.body.amount_ml) {
      res.status(400).json({ error: 'amount_ml é obrigatório' });
      return;
    }
    const data = await hydrationService.addLog(req.userId!, req.body.amount_ml);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteLog(req: AuthRequest, res: Response): Promise<void> {
  try {
    await hydrationService.deleteLog(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
