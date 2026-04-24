import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as habitsService from '../services/habits.service';

export async function getHabits(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await habitsService.getHabits(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getTodayHabits(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await habitsService.getTodayHabits(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createHabit(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.body.name) {
      res.status(400).json({ error: 'name é obrigatório' });
      return;
    }
    const data = await habitsService.createHabit(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateHabit(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await habitsService.updateHabit(req.userId!, req.params.id, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteHabit(req: AuthRequest, res: Response): Promise<void> {
  try {
    await habitsService.deleteHabit(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function completeHabit(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await habitsService.completeHabit(req.userId!, req.params.id);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function uncompleteHabit(req: AuthRequest, res: Response): Promise<void> {
  try {
    await habitsService.uncompleteHabit(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
