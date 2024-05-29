import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarTaskProps {
  tasks: any[];
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

export const CalendarTask = ({ tasks }: CalendarTaskProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]); //CalendarEvent[] indica che lo stato events deve essere un array di oggetti che rispettano l'interfaccia CalendarEvent. Questo garantisce che ogni evento abbia le proprietà title, start ed end. 

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = tasks.map((task) => ({
      title: task.description,
      start: new Date(task.date),
      end: new Date(task.date),
    }));

    setEvents(calendarEvents);
  }, [tasks]);
  
  const [currentMonth, setCurrentMonth] = useState(moment());

  return (
        <div>
          <div className="flex justify-between">
        <Button 
          onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))} 
          className='bg-amber-600 text-black hover:bg-amber-900'
        > 
            Previous </Button>
        <div>
        </div>
        <Button 
          onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))} 
          className='bg-amber-600 text-black hover:bg-amber-900'
        > 
            Next </Button>
      </div>
          <BigCalendar
            localizer={localizer}
            events={events}
            toolbar={true}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh', width: '70vw' }} // Fill the dialog
            eventPropGetter={(event, start, end, isSelected) => ({
              style: {
                fontSize: '12px',
                backgroundColor: 'black'
              }
            })}
            defaultView='month'
            components={{
              toolbar: ({ label }) => (
                <div className='relative top-1'>
                  <span>{label}</span> 
                </div>
              )
            }}
            date={currentMonth.toDate()} 
            onNavigate={(newDate) => setCurrentMonth(moment(newDate))}
    
          />
          </div>
  );
};