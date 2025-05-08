import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { BookingModal } from './components/BookingModal';
import * as Types from './models/types';
import { getSlots, getCandidates, getEngineers, bookSlot } from './services/api';
import { toCalendarSlot } from './utils';
import { Filters, FilterType } from './components/Filters';
import { log } from 'console';

function App() {
  const [slots, setSlots] = useState<Types.CalendarSlot[]>([]);
  const [engineers, setEngineers] = useState<Types.Engineer[]>([])
  const [candidates, setCandidates] = useState<Types.Candidate[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Types.CalendarSlot | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);

  useEffect(() => {
    Promise.all([getSlots(), getCandidates(), getEngineers()])
      .then(([slotsData, candidates, engineers]: [Types.Slot[], Types.Candidate[], Types.Engineer[]]) => {
        console.log('raw slots', slotsData);
        setSlots(slotsData.map(toCalendarSlot))
        console.log('mapped CalendarSlots', slotsData.map(toCalendarSlot))
        setEngineers(engineers)
        setCandidates(candidates)
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (
    slot: Types.CalendarSlot,
    candidateId: string,
    engineerId: string
  ): Promise<void> => {
    setSlots(prev =>
      prev.map(s =>
        s.id === slot.id ? { ...s, title: 'Booked' } : s
      )
    )
    setSelectedSlot(null);

    await bookSlot(slot.id, candidateId, engineerId)
  }

  if (loading) return <div className="p-4">Loading…</div>;

  /**
 * Filters the available slots based on the selected filter type and filter ID.
 * 
 * This function dynamically filters the `slots` array to include only those
 * that match the availability of a selected candidate or engineer. The filtering
 * is determined by the `filterType` and `filterId` state variables.
 * 
 * - If `filterType` is `'candidate'`, it checks if the slot falls within the
 *   availability of the candidate with the matching `filterId`.
 * - If `filterType` is `'engineer'`, it checks if the slot falls within the
 *   availability of the engineer with the matching `filterId`.
 * - If `filterType` is `'none'` or `filterId` is empty, no filtering is applied.
 * 
 * @returns {Types.CalendarSlot[]} A filtered array of slots that match the
 * availability of the selected candidate or engineer.
 * 
 * @example
 * // Assuming filterType = 'candidate' and filterId = '123'
 * const filteredSlots = filteredByPerson;
 * console.log(filteredSlots); // Logs slots matching candidate 123's availability
 * 
 * @note
 * - The function uses `Array.prototype.filter` to iterate over the slots.
 * - Availability is checked using `Array.prototype.some` to ensure the slot
 *   falls within at least one availability period.
 * - If no candidate or engineer matches the `filterId`, the slot is excluded.
 */
  const filteredByPerson = slots.filter((s) => {
    if(filterType === 'none' || !filterId) 
      return true
    if (filterType === 'candidate') {
      const cand = candidates.find((c) => c.id === filterId)
      console.log('filteredByPerson cand', cand);      
      if (!cand) return false
      return cand.availability.some((a) => {
        const start = new Date(a.start)
        const end = new Date(a.end)
        return s.start >= start && s.end <= end
      })
    }
    if (filterType === 'engineer' && filterId) {
      const eng = engineers.find((e) => e.id === filterId)
      if (!eng) return false
      return eng.availability.some((a) => {
        const start = new Date(a.start)
        const end = new Date(a.end)
        return s.start >= start && s.end <= end
      })
    }
    return true
  })

  console.log('filteredByPerson before filteredSlots', filteredByPerson);
  

  /**
 * Filters the available slots to match the required duration.
 * 
 * This function takes the already filtered slots (`filteredByPerson`) and further
 * filters them to ensure that only slots with the specified duration are included.
 * 
 * - If the `duration` is 15 minutes, it directly returns the `filteredByPerson` array.
 * - For longer durations, it groups consecutive 15-minute slots into blocks of the
 *   required duration and includes only those blocks that are fully available.
 * 
 * @returns {Types.CalendarSlot[]} A filtered array of slots that match the required duration.
 * 
 * @example
 * // Assuming duration = 30 and filteredByPerson contains 15-minute slots
 * const filteredSlots = filteredSlot;
 * console.log(filteredSlots); // Logs slots grouped into 30-minute blocks
 * 
 * @note
 * - The function uses a `Map` to group slots by their start time for efficient lookup.
 * - It iterates over the slots and checks if consecutive slots exist to form a block
 *   of the required duration.
 * - Only slots with the title `'Free'` are considered for grouping.
 */
  const filteredSlots: Types.CalendarSlot[] = (() => {
    if (duration === 15) 
      return filteredByPerson
    const blockSize = duration / 15
    const slotMap = new Map<number, Types.CalendarSlot>()
    console.log('slotMap', slotMap);
    

    filteredByPerson.forEach((s) => {
      if (s.title === 'Free')
        slotMap.set(s.start.getTime(), s)
    })

    const result: Types.CalendarSlot[] = []
    slotMap.forEach((slot, time) => {
      let ok = true
      for (let i = 1; i < blockSize; i++) {
        if (!slotMap.has(time + i * 15 * 60 * 1000)) {
          ok = false
          break
        }
      }
      if (ok)
        result.push(slot)
    })
    return result
  })()


  console.log('filtered slots', filteredSlots);

  return (
    <div className='h-full relative'>
      <Filters
        candidates={candidates}
        engineers={engineers}
        filterType={filterType}
        filterId={filterId}
        duration={duration}
        onFilterTypeChange={setFilterType}
        onFilterIdChange={setFilterId}
        onDurationChange={setDuration}
      />
      <Calendar slots={filteredSlots} onSelectSlot={setSelectedSlot} />
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          candidates={candidates}
          engineers={engineers}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default App;
