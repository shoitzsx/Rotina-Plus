import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as studiesService from '../services/studies.service';

export async function getSubjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await studiesService.getSubjects(req.userId!);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createSubject(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.body.name) {
      res.status(400).json({ error: 'name é obrigatório' });
      return;
    }
    const data = await studiesService.createSubject(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateSubject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await studiesService.updateSubject(req.userId!, req.params.id, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteSubject(req: AuthRequest, res: Response): Promise<void> {
  try {
    await studiesService.deleteSubject(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getSessions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { date, subject_id } = req.query as { date?: string; subject_id?: string };
    const data = await studiesService.getSessions(req.userId!, { date, subject_id });
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createSession(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.body.duration_minutes) {
      res.status(400).json({ error: 'duration_minutes é obrigatório' });
      return;
    }
    const data = await studiesService.createSession(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteSession(req: AuthRequest, res: Response): Promise<void> {
  try {
    await studiesService.deleteSession(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
