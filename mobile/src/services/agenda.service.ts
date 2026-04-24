import { api } from './api';
import { Event, CreateEventDTO, UpdateEventDTO } from '../types';

export async function getEvents(from?: string, to?: string): Promise<Event[]> {
  const { data } = await api.get<Event[]>('/agenda', { params: { from, to } });
  return data;
}

export async function getEvent(id: string): Promise<Event> {
  const { data } = await api.get<Event>(`/agenda/${id}`);
  return data;
}

export async function createEvent(payload: CreateEventDTO): Promise<Event> {
  const { data } = await api.post<Event>('/agenda', payload);
  return data;
}

export async function updateEvent(id: string, payload: UpdateEventDTO): Promise<Event> {
  const { data } = await api.put<Event>(`/agenda/${id}`, payload);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/agenda/${id}`);
}
