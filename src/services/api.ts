import { Slot, Candidate, Engineer } from '../models/types';

export async function getSlots(): Promise<Slot[]> {
  const res = await fetch('/data/slots.json');
  if (!res.ok) throw new Error('Failed to load slots');
  return res.json();
}

export async function bookSlot(slotId: string, candidateId: string, engineerId: string) {
  return new Promise((resolve, reject) => setTimeout(resolve, 500));
}

export async function getCandidates(): Promise<Candidate[]> {
  const res = await fetch('/data/candidates.json');
  if (!res.ok) throw new Error('Failed to load candidates');
  return res.json();
}

export async function getEngineers(): Promise<Engineer[]> {
  const res = await fetch('/data/engineers.json');
  if (!res.ok) throw new Error('Failed to load engineers');
  return res.json();
}