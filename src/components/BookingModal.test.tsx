import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BookingModal } from '../components/BookingModal'
import type { CalendarSlot, Candidate, Engineer } from '../models/types'

type BookingModalProps = {
  slot: CalendarSlot
  candidates: Candidate[]
  engineers: Engineer[]
  initialCandidateId?: string
  initialEngineerId?: string
  onClose: () => void
  onConfirm: (slot: CalendarSlot, candidateId: string, engineerId: string) => void
}

describe('BookingModal', () => {
  const slot: CalendarSlot = {
    id: 'slot-1',
    start: new Date('2025-05-12T10:00:00-07:00'),
    end: new Date('2025-05-12T10:15:00-07:00'),
    engineerId: 'e1',
    engineerName: 'Alice Wong',
    color: '#3B82F6',
    status: 'available',
    candidateId: undefined,
    title: 'Alice Wong',
  }

  const candidates: Candidate[] = [
    { id: 'c1', firstName: 'Alice', lastName: 'Smith', email: 'a@example.com', availability: [] },
    { id: 'c2', firstName: 'Bob', lastName: 'Jones', email: 'b@example.com', availability: [] },
  ]

  const engineers: Engineer[] = [
    { id: 'e1', firstName: 'Alice', lastName: 'Wong', email: 'aw@example.com', timezone: 'America/Vancouver', color: '#3B82F6', availability: [] },
    { id: 'e2', firstName: 'Carol', lastName: 'Nguyen', email: 'c@example.com', timezone: 'America/Vancouver', color: '#10B981', availability: [] },
  ]

  const defaultProps = (): BookingModalProps => ({
    slot,
    candidates,
    engineers,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  })

  it('pre-selects values from initialCandidateId and initialEngineerId', () => {
    const props = defaultProps()
    const initialCandidateId = candidates[1].id
    const initialEngineerId = engineers[1].id
    render(
      <BookingModal
        {...props}
        initialCandidateId={initialCandidateId}
        initialEngineerId={initialEngineerId}
      />
    )

    const candidateSelect = screen.getByLabelText('Candidate') as HTMLSelectElement
    expect(candidateSelect.value).toBe(initialCandidateId)

    const engineerSelect = screen.getByLabelText('Engineer') as HTMLSelectElement
    expect(engineerSelect.value).toBe(initialEngineerId)
  })

  it('calls onClose when Cancel is clicked', () => {
    const props = defaultProps()
    render(<BookingModal {...props} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(props.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm with correct arguments when Confirm is clicked', () => {
    const props = defaultProps()
    render(<BookingModal {...props} />)
    const candidateSelect = screen.getByLabelText('Candidate') as HTMLSelectElement
    const engineerSelect = screen.getByLabelText('Engineer') as HTMLSelectElement

    // change selects to non-default values
    fireEvent.change(candidateSelect, { target: { value: candidates[1].id } })
    fireEvent.change(engineerSelect, { target: { value: engineers[1].id } })

    fireEvent.click(screen.getByText('Confirm'))
    expect(props.onConfirm).toHaveBeenCalledWith(
      slot,
      candidates[1].id,
      engineers[1].id
    )
  })
})
