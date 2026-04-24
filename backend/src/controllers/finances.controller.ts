import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as financesService from '../services/finances.service';

export async function getTransactions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { month, year, type } = req.query as { month?: string; year?: string; type?: string };
    const data = await financesService.getTransactions(req.userId!, { month, year, type });
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createTransaction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, amount, type } = req.body;
    if (!title || !amount || !type) {
      res.status(400).json({ error: 'title, amount e type são obrigatórios' });
      return;
    }
    const data = await financesService.createTransaction(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateTransaction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await financesService.updateTransaction(req.userId!, req.params.id, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteTransaction(req: AuthRequest, res: Response): Promise<void> {
  try {
    await financesService.deleteTransaction(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getCategories(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await financesService.getCategories(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.body.name || !req.body.type) {
      res.status(400).json({ error: 'name e type são obrigatórios' });
      return;
    }
    const data = await financesService.createCategory(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    await financesService.deleteCategory(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getMonthlySummary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { month, year } = req.query as { month?: string; year?: string };
    const data = await financesService.getMonthlySummary(req.userId!, month, year);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}
