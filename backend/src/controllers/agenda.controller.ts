import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as agendaService from '../services/agenda.service';

export async function getEvents(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await agendaService.getEvents(req.userId!, from, to);
    res.json(data);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await agendaService.getEvent(req.userId!, req.params.id);
    res.json(data);
  } catch (error: unknown) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, date } = req.body as { title?: string; date?: string };

    if (!title || !date) {
      res.status(400).json({ error: 'title e date são obrigatórios' });
      return;
    }

    const data = await agendaService.createEvent(req.userId!, req.body);
    res.status(201).json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = await agendaService.updateEvent(req.userId!, req.params.id, req.body);
    res.json(data);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    await agendaService.deleteEvent(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
}
