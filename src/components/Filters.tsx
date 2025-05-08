import React from 'react'
import type { Candidate, Engineer } from '../models/types'

export type FilterType = 'none' | 'candidate' | 'engineer'

export type FiltersProps = {
  candidates: Candidate[]
  engineers: Engineer[]
  filterType: FilterType
  filterId: string
  duration: number
  onFilterTypeChange: (ft: FilterType) => void
  onFilterIdChange: (id: string) => void
  onDurationChange: (mins: number) => void
}

export const Filters: React.FC<FiltersProps> = ({
  candidates,
  engineers,
  filterType,
  filterId,
  duration,
  onFilterTypeChange,
  onFilterIdChange,
  onDurationChange,
}) => {
  return (
    <div className="p-4 flex flex-wrap gap-4 items-end bg-white shadow">
      <div>
        <label className="block text-sm font-medium">Filter by</label>
        <select
          className="mt-1 block rounded border-gray-300"
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
        >
          <option value="none">None</option>
          <option value="candidate">Candidate</option>
          <option value="engineer">Engineer</option>
        </select>
      </div>

      {filterType === 'candidate' && (
        <div>
          <label className="block text-sm font-medium">Candidate</label>
          <select
            className="mt-1 block rounded border-gray-300"
            value={filterId}
            onChange={(e) => onFilterIdChange(e.target.value)}
          >
            <option value="">Select…</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterType === 'engineer' && (
        <div>
          <label className="block text-sm font-medium">Engineer</label>
          <select
            className="mt-1 block rounded border-gray-300"
            value={filterId}
            onChange={(e) => onFilterIdChange(e.target.value)}
          >
            <option value="">Select…</option>
            {engineers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Duration</label>
        <select
          className="mt-1 block rounded border-gray-300"
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
        >
          {[15, 30, 60].map((mins) => (
            <option key={mins} value={mins}>
              {mins} min
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
