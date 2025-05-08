import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { BookingModal } from './components/BookingModal';
import * as Types from './models/types';
import { getCandidates, getEngineers, bookSlot } from './services/api';
//import { toCalendarSlot } from './utils';
import { Filters, FilterType } from './components/Filters';

function App() {
  const [slots, setSlots] = useState<Types.CalendarSlot[]>([]);
  const [engineers, setEngineers] = useState<Types.Engineer[]>([])
  const [candidates, setCandidates] = useState<Types.Candidate[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Types.CalendarSlot | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [modalCandidateId, setModalCandidateId] = useState<string>('');
  const [modalEngineerId, setModalEngineerId] = useState<string>('');

  useEffect(() => {
    Promise.all([getCandidates(), getEngineers()])
      .then(([candidates, engineers]: [Types.Candidate[], Types.Engineer[]]) => {
        //console.log('raw slots', slotsData);
        //console.log('mapped CalendarSlots', slotsData.map(toCalendarSlot))
        setEngineers(engineers)
        setCandidates(candidates)
        const allSlots: Types.CalendarSlot[] = engineers.flatMap((engineer) => {
          return engineer.availability.flatMap((window) => {
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
        })
        setSlots(allSlots)
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
        s.id === slot.id ? {
          ...s,
          status: 'booked',
          candidateId,
          title: 'Booked',
          color: '#6B7280'
        } : s
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
    if (filterType === 'none' || !filterId)
      return true
    if (filterType === 'candidate') {
      const cand = candidates.find((c) => c.id === filterId)
      //console.log('filteredByPerson cand', cand);
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


    filteredByPerson.forEach((s) => {
      if (s.status === 'available')
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
      <Calendar slots={filteredSlots} onSelectSlot={(slot) => {
        setModalEngineerId(slot.engineerId)
        setModalCandidateId(filterType === 'candidate' ? filterId : '')
        setSelectedSlot(slot)
      }} />
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          candidates={candidates}
          engineers={engineers}
          initialCandidateId={modalCandidateId}
          initialEngineerId={modalEngineerId}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default App;
