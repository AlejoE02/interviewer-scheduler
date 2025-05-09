import { useMemo } from 'react'
import * as Types from '../models/types'

export function useFilteredSlots(
  slots: Types.CalendarSlot[],
  candidates: Types.Candidate[],
  filterType: 'none' | 'engineer' | 'candidate',
  filterId: string,
  duration: number
): Types.CalendarSlot[] {
  const filteredByPerson = useMemo(() => {
    if (filterType === 'candidate') {
      if (!filterId) return slots
      const candidate = candidates.find((c) => c.id === filterId)
      if (!candidate) return slots

      return slots.filter((slot) =>
        candidate.availability.some((a) => {
          const start = new Date(a.start)
          const end   = new Date(a.end)
          return slot.start >= start && slot.end <= end
        })
      )
    }

    if (filterType === 'engineer') {
      if (!filterId) return slots
      return slots.filter((slot) => slot.engineerId === filterId)
    }

    return slots
  }, [slots, filterType, filterId, candidates])

  const filteredSlots = useMemo(() => {
    if (duration === 15) {
      return filteredByPerson
    }

    const blockSize = duration / 15
    const slotMap = new Map<number, Types.CalendarSlot>()

    filteredByPerson.forEach((s) => {
      if (s.status === 'available') {
        slotMap.set(s.start.getTime(), s)
      }
    })

    const result: Types.CalendarSlot[] = []
    slotMap.forEach((_, time) => {
      let ok = true
      for (let i = 1; i < blockSize; i++) {
        if (!slotMap.has(time + i * 15 * 60 * 1000)) {
          ok = false
          break
        }
      }
      if (ok) {
        result.push(slotMap.get(time)!)
      }
    })

    return result
  }, [filteredByPerson, duration])

  return filteredSlots
}
