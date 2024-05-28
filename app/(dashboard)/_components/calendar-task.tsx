import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export const CalendarTask = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
        <div>
          <BigCalendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh', width: '70vw' }} // Fill the dialog
          />
          </div>
  );
};