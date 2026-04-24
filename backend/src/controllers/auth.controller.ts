import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'name, email e password são obrigatórios' });
      return;
    }
    const data = await authService.register({ name, email, password });
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email e password são obrigatórios' });
      return;
    }
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (error: unknown) {
    res.status(401).json({ error: (error as Error).message });
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const profile = await authService.getProfile(req.userId!);
    res.json(profile);
  } catch (error: unknown) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const profile = await authService.updateProfile(req.userId!, req.body);
    res.json(profile);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
