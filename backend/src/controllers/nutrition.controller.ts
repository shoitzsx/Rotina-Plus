import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as nutritionService from '../services/nutrition.service';

export async function getMeals(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { date } = req.query as { date?: string };
    const data = await nutritionService.getMeals(req.userId!, date);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createMeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, meal_type } = req.body;
    if (!name || !meal_type) {
      res.status(400).json({ error: 'name e meal_type são obrigatórios' });
      return;
    }
    const data = await nutritionService.createMeal(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateMeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await nutritionService.updateMeal(req.userId!, req.params.id, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteMeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    await nutritionService.deleteMeal(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
