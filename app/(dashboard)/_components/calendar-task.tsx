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
    const calendarEvents: CalendarEvent[] = tasks
    .filter((task) => task.date)
    .map((task) => ({
      title: task.description,
      start: new Date(task.date),
      end: new Date(task.date), //is only taking tasks from the user, not displaying org tasks. 
    }));

    setEvents(calendarEvents);
  }, [tasks]);
  
  const [currentMonth, setCurrentMonth] = useState(moment());

  return (
        <div>
        <div>
          <div className="flex justify-between flex-grow">
        <Button 
          onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))} 
          className='bg-amber-500 text-black hover:bg-amber-800'
        > 
            Previous </Button>
        <div>
        </div>
        <Button 
          onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))} 
          className='bg-amber-500 text-black hover:bg-amber-800'
        > 
            Next </Button>
      </div>
          <BigCalendar
            localizer={localizer}
            events={events}
            toolbar={true}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh', width: '70vw' }} 
            eventPropGetter={(event, start, end, isSelected) => ({
              style: {
                fontSize: '12px',
                backgroundColor: 'black'
              }
            })}
            defaultView='month'
            components={{
              toolbar: ({ label }) => (
                <div className="rbc-toolbar">
                  <span className="rbc-toolbar-label">{label}</span> 
                </div>
              )
            }}
            date={currentMonth.toDate()} 
            onNavigate={(newDate) => setCurrentMonth(moment(newDate))}
            dayPropGetter={(date) => {
              const isCurrentMonth = date.getMonth() === currentMonth.month(); 
          
              return {
                style: {
                  backgroundColor: isCurrentMonth ? '#ffb300' : '#ffee58', // Light gray for non-current month days
                }
              };
            }}
          />
          </div>
          <div className='relative py-8'>
            <div className='absolute inset-x-0 bottom-o h-px bg-gradient-to-r from-transparent via-black to-transparent'></div>
          </div>
          </div>
  );
};