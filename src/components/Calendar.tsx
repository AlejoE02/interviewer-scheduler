import { Calendar as RbcCalendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { CalendarSlot, MyEvent } from '../models/types'


const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

type CalendarProps = {
  slots: CalendarSlot[]
  onSelectSlot: (slot: CalendarSlot) => void
}

export function Calendar({ slots, onSelectSlot }: CalendarProps) {
  //console.log('Calendar received slots', slots);
  
  const events: MyEvent[] = slots.map(s => ({
    id: s.id,
    start: s.start,
    end: s.end,
    title: s.title || 'Available',
  }))

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
        style={{ height: '100%' }}
        selectable
        onSelectEvent={(event: MyEvent) => {
          if (!onSelectSlot) return
            const slot = slots.find((s) => s.id === event.id)
          if (slot) {
            onSelectSlot(slot)
          }
        }}
        toolbar={false}
      />
    </div>
  )
}
