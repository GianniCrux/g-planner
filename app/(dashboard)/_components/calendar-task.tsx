import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDaysIcon, EyeIcon } from "lucide-react";
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
  _id: string;
  startTime?: string;
  endTime?: string; 
}

export const CalendarTask = ({ tasks }: CalendarTaskProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]); //CalendarEvent[] indica che lo stato events deve essere un array di oggetti che rispettano l'interfaccia CalendarEvent. Questo garantisce che ogni evento abbia le proprietà title, start ed end. 
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'work_week' | 'agenda'>('month');

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = tasks
    .filter(task => !task.isCompleted)
    .map((task) => {
      const baseDate = new Date(task.date);
      let startDate, endDate;
  
      if (task.startTime && task.endTime) {
        const [startHour, startMinute] = task.startTime.split(":").map(Number);
        const [endHour, endMinute] = task.endTime.split(":").map(Number);
  
        baseDate.setHours(startHour, startMinute, 0); // Set start time
        startDate = new Date(baseDate);
  
        baseDate.setHours(endHour, endMinute, 0); // Set end time
        endDate = new Date(baseDate);
      } else {
        // If no start and end time, treat it as an all-day event
        startDate = new Date(task.date);
        endDate = new Date(task.date);
      }
  
      return {
        ...task,
        start: startDate,
        end: endDate,
        startTime: task.startTime,
        endTime: task.endTime,
      };
    });
  
    setEvents(calendarEvents);
  }, [tasks]);
  
  const [currentMonth, setCurrentMonth] = useState(moment());

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    const selectedDateEvents = events.filter((event) => moment(event.start).isSame(moment(start), 'day') && !event.isCompleted);
    setTasksForSelectedDate(selectedDateEvents);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedDate(null);
    setTasksForSelectedDate([]);
  };

  const handleViewChange = () => {
    setCurrentView((prevView) => {
      if (prevView === 'month') return 'week';
      if (prevView === 'week') return 'day';
      if (prevView === 'day') return 'month';
      return 'month';
    });
  };


  return (
    <div className="relative bg-transparent text-xl shadow-lg overflow-hidden p-8 md:p-16 dark:bg-amber-900">
  <div className="absolute inset-0 opacity-70">
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 dark:from-amber-800 dark:via-amber-700 dark:to-amber-800"></div>
  </div>
      <div className='relative z-10'>
      <span className="top-1 relative">
            <Button
            onClick={handleViewChange}
            className='bg-transparent text-black hover:bg-transparent'
          >
            {currentView === 'month' ? <EyeIcon /> : currentView === 'week' ? <CalendarDaysIcon /> : <Calendar />}
          </Button>  

          </span>

          <BigCalendar
            onSelectEvent={handleSelectSlot}
            selectable
            localizer={localizer}
            events={events}
            toolbar={true}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh', width: '100%' }} 
            eventPropGetter={(event, start, end, isSelected) => ({
              style: {
                fontSize: '12px',
                backgroundColor: 'black',
                color: 'tan',
              }
            })}
            view={currentView}
            components={{
              toolbar: ({ label, onNavigate, view }) => (
                <div className="rbc-toolbar flex justify-between items-center">
                  <span className="rbc-toolbar-label text-amber-600 text-xl dark:text-amber-300">{label}</span>
                  <div className="rbc-btn-group pt-2">
                    <Button 
                      className="!bg-amber-300 text-black hover:!bg-amber-500 dark:!bg-amber-700 dark:hover:!bg-amber-900 dark:text-black dark:hover:text-black !border-none"
                      onClick={() => onNavigate('TODAY')}
                    >
                      Today
                    </Button>
                    <Button
                      className="!bg-amber-300 text-black hover:!bg-amber-500 dark:!bg-amber-700 dark:hover:!bg-amber-900 dark:text-black dark:hover:text-black !border-none"
                      onClick={() => onNavigate('PREV')}
                    >
                      Back
                    </Button>
                    <Button
                      className="!bg-amber-300 text-black hover:!bg-amber-500 dark:!bg-amber-700 dark:hover:!bg-amber-900 dark:text-black dark:hover:text-black !border-none"
                      onClick={() => onNavigate('NEXT')}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ),
              header: ({ date, label }) => (
                <div className='rbc-day-header text-base text-amber-600'>{label}</div>
              ),
            }}
            date={currentMonth.toDate()} 
            onView={(view) => setCurrentView(view)}
            onNavigate={(newDate) => setCurrentMonth(moment(newDate))}
            dayPropGetter={(date) => {
              const isCurrentMonth = date.getMonth() === currentMonth.month(); 
          
              return {
                className: isCurrentMonth 
                  ? 'bg-amber-300 dark:bg-amber-700 text-black dark:text-amber-100' 
                  : '!bg-amber-200 dark:bg-amber-500 text-gray-900 dark:text-amber-200'
              };
            }}
          />
 
          <div className='relative py-8'>
            <div className='absolute inset-x-0 bottom-o h-px bg-gradient-to-r from-transparent via-black to-transparent'></div>
          </div>
          {showDialog && selectedDate && ( 
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
              <DialogContent className="bg-amber-400 max-h-[600px] overflow-auto">
                {tasksForSelectedDate.map((task) => (
                  <TaskCard key={task._id} {...task} hideCheckbox={true} />
                ))}
                {tasksForSelectedDate.length === 0 && (
                  <p>No tasks available for the selected date.</p>
                )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  </div>
  );
};