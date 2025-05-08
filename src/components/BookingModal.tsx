import React, { useState} from 'react'
import type { CalendarSlot, Candidate, Engineer } from '../models/types'

type BookingModalProps = {
  slot: CalendarSlot
  candidates: Candidate[]
  engineers: Engineer[]
  onClose: () => void
  onConfirm: (slot: CalendarSlot, candidateId: string, engineerId: string) => void
}

export function BookingModal({ slot, candidates, engineers, onClose, onConfirm }: BookingModalProps) {
  const [candidateId, setCandidateId] = useState<string>(candidates[0]?.id ?? '')
  const [engineerId, setEngineerId]   = useState<string>(engineers[0]?.id   ?? '')
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>

        <p className="mb-4">
          <strong>When:</strong>{' '}
          {slot.start.toLocaleString()} – {slot.end.toLocaleTimeString()}
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium">Candidate</span>
            <select
              className="mt-1 block w-full rounded border-gray-300"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Engineer</span>
            <select
              className="mt-1 block w-full rounded border-gray-300"
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
            >
              {engineers.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(slot, candidateId, engineerId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
