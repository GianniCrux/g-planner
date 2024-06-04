import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogClose, DialogContent, DialogFooter} from '@/components/ui/dialog';
import { TaskCard, TaskCardProps } from './task-card';


const localizer = momentLocalizer(moment);

interface CalendarTaskProps {
  tasks: any[];
}

interface CalendarEvent extends TaskCardProps {
  start: Date;
  end: Date;
}

export const CalendarTask = ({ tasks }: CalendarTaskProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]); //CalendarEvent[] indica che lo stato events deve essere un array di oggetti che rispettano l'interfaccia CalendarEvent. Questo garantisce che ogni evento abbia le proprietà title, start ed end. 
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);


  useEffect(() => {
    const calendarEvents: CalendarEvent[] = tasks.filter((task) => task.date).map((task) => ({
      ...task, // Include all task properties in the calendar event
      start: new Date(task.date),
      end: new Date(task.date),
    }));

    setEvents(calendarEvents);
  }, [tasks]);
  
  const [currentMonth, setCurrentMonth] = useState(moment());

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event);  // Set the selected task directly
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedTask(null);
  };

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
            onSelectEvent={handleSelectEvent}
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
          {showDialog && selectedTask && ( 
        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="bg-amber-400">
            <TaskCard {...selectedTask} /* add multiple tasks per day view */ /> 
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleCloseDialog}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
          </div>
  );
};