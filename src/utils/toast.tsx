import toast from 'react-hot-toast'
import { format } from 'date-fns'
import type { CalendarSlot, Candidate, Engineer } from '../models/types'

export function showBookingToast(
  slot: CalendarSlot,
  cand: Candidate,
  eng: Engineer
) {
  const when = format(slot.start, "EEEE, MMM d 'at' p")
  toast.success(
    <div>
      <strong>Interview Confirmed!</strong><br/>
      {cand.firstName} with {eng.firstName}<br/>
      <small>{when}</small>
    </div>,
    { position: 'top-right', duration: 5000 }
  )
}
