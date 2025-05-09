import { useState, useEffect } from 'react';
import { getCandidates, getEngineers, bookSlot } from '../services/api';
import * as Types from '../models/types';

export function useSlotsData() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Types.CalendarSlot[]>([]);
  const [engineers, setEngineers] = useState<Types.Engineer[]>([]);
  const [candidates, setCandidates] = useState<Types.Candidate[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [candidates, engineers] = await Promise.all([getCandidates(), getEngineers()]);
        setCandidates(candidates);
        setEngineers(engineers);

        const allSlots: Types.CalendarSlot[] = engineers.flatMap((engineer) =>
          engineer.availability.flatMap((window) => {
            const startMs = new Date(window.start).getTime();
            const endMs = new Date(window.end).getTime();
            const slots: Types.CalendarSlot[] = [];
            for (let time = startMs;
              time + 15 * 60 * 1000 <= endMs;
              time += 15 * 60 * 1000) {
              slots.push({
                id: `${engineer.id}-${time}`,
                start: new Date(time),
                end: new Date(time + 15 * 60 * 1000),
                title: `${engineer.firstName} ${engineer.lastName} - Free`,
                engineerId: engineer.id,
                color: engineer.color,
                status: 'available'
              })
            }
            return slots;
          })
        )
        setSlots(allSlots);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  const book = async (slotId: string, candidateId: string, engineerId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, status: 'booked', candidateId, color: '#6B7280', title: 'Booked' }
          : s
      )
    )
    await bookSlot(slotId, candidateId, engineerId)
  }
  return { slots, loading, engineers, candidates, book }
}