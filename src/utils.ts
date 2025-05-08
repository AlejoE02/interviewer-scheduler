import type { Slot, CalendarSlot } from './models/types';

/**
 * Converts a Slot object to a CalendarSlot object.
 * @param {Slot} slot - The Slot object to convert.
 * @returns {CalendarSlot} - The converted CalendarSlot object.
 */
export function toCalendarSlot(slot: Slot): CalendarSlot {
  return {
    id: slot.id,
    start: new Date(slot.start),
    end: new Date(slot.end),
    title: slot.status === 'available' ? 'Available' : undefined,
  };
}