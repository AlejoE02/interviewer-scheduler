import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Calendar } from './components/Calendar';
import { BookingModal } from './components/BookingModal';
import { Filters, FilterType } from './components/Filters';
import { useSlotsData } from './hooks/useSlotsData';
import { useFilteredSlots } from './hooks/useFilteredSlots';
import { showBookingToast } from './utils/toast';
import type { CalendarSlot } from './models/types';


function App() {
  const { loading, slots, engineers, candidates, book } = useSlotsData();
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [modalCandidateId, setModalCandidateId] = useState<string>('');
  const [modalEngineerId, setModalEngineerId] = useState<string>('');
  const filteredSlots = useFilteredSlots(slots, candidates, filterType, filterId, duration);

  const handleSlotClick = (slot: CalendarSlot) => {
    setModalEngineerId(slot.engineerId);
    setModalCandidateId(filterType === 'candidate' ? filterId : '');
    setSelectedSlot(slot);
  }

  const handleConfirm = async (
    slot: CalendarSlot,
    candidateId: string,
    engineerId: string
  ): Promise<void> => {
    setSelectedSlot(null);
    await book(slot.id, candidateId, engineerId)

    const eng = engineers.find(e => e.id === engineerId)!
    const cand = candidates.find(c => c.id === candidateId)!
    showBookingToast(slot, cand, eng)
  }

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <>
      <Toaster />
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
        <Calendar slots={filteredSlots} onSelectSlot={handleSlotClick} />
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
    </>
  );
}

export default App;
