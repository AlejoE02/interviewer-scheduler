import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from './App'
import * as api from './services/api'
import type { Candidate, Engineer } from './models/types'

// Mock the API responses
const mockCandidates: Candidate[] = [
  {
    id: 'c1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com',
    availability: [ { id: 'c1-1', start: '2025-05-12T09:00:00-07:00', end: '2025-05-12T12:00:00-07:00' } ]
  }
]
const mockEngineers: Engineer[] = [
  {
    id: 'e1', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com',
    timezone: 'America/Vancouver', color: '#3B82F6',
    availability: [ { id: 'e1-1', start: '2025-05-12T09:00:00-07:00', end: '2025-05-12T10:00:00-07:00' } ]
  }
]

describe('<App />', () => {
  beforeEach(() => {
    jest.spyOn(api, 'getCandidates').mockResolvedValue(mockCandidates)
    jest.spyOn(api, 'getEngineers').mockResolvedValue(mockEngineers)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows loading initially and then displays filters', async () => {
    render(<App />)
    expect(screen.getByText(/Loading…/i)).toBeInTheDocument()
    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/Loading…/i)).not.toBeInTheDocument())
    // Filter controls should appear
    expect(screen.getByLabelText(/Filter by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument()
  })

  it('shows candidate dropdown when filter type is candidate', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading…/i)).not.toBeInTheDocument())
    const filterSelect = screen.getByLabelText(/Filter by/i)
    fireEvent.change(filterSelect, { target: { value: 'candidate' } })
    expect(screen.getByLabelText(/Candidate/i)).toBeInTheDocument()
  })

  it('shows engineer dropdown when filter type is engineer', async () => {
    render(<App />)
    await waitFor(() => expect(screen.queryByText(/Loading…/i)).not.toBeInTheDocument())
    const filterSelect = screen.getByLabelText(/Filter by/i)
    fireEvent.change(filterSelect, { target: { value: 'engineer' } })
    expect(screen.getByLabelText(/Engineer/i)).toBeInTheDocument()
  })
})
