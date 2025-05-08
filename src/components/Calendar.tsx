import { CSSProperties, useState } from 'react'
import { Calendar as RbcCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { CalendarSlot, MyEvent } from '../models/types'


const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

type CalendarProps = {
  slots: CalendarSlot[]
  onSelectSlot: (slot: CalendarSlot) => void
}

export function Calendar({ slots, onSelectSlot }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const events: MyEvent[] = slots.map(s => ({
    id: s.id,
    start: s.start,
    end: s.end,
    title: s.title || 'Available',
    resource: s
  }))

  const eventStyleGetter = (event: any) => {
    const slot: CalendarSlot = event.resource
    const style: CSSProperties = {
      backgroundColor: slot.color,
      opacity: slot.status === 'booked' ? 0.6 : 1,
      pointerEvents: slot.status === 'booked' ? 'none' : 'auto',
      borderRadius: '0.25rem',
      border: 'none',
      color: 'white'
    }
    return { style }
  }


  return (
    <div className="h-screen p-4">
      <RbcCalendar<MyEvent>
        localizer={localizer}
        events={events}
        defaultView="work_week"
        views={['work_week']}
        step={15}
        timeslots={1}
        min={new Date(0, 0, 0, 9, 0)}
        max={new Date(0, 0, 0, 17, 0)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        toolbar
        style={{ height: '100%' }}
        selectable
        onSelectEvent={(event: MyEvent) => {
          const slot: CalendarSlot = event.resource
          if (slot.status === 'available' && onSelectSlot) {
            onSelectSlot(slot)
          }
        }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  )
}
