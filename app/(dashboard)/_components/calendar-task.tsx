import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as Dialog from '@radix-ui/react-dialog';

const localizer = momentLocalizer(moment);

export const CalendarTask = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <Dialog.Root open={showCalendar} onOpenChange={setShowCalendar}>
      <Dialog.Trigger asChild>
        <Button
          className="bg-amber-300 text-semibold font-normal justify-start px-2 w-full hover:bg-amber-400 active:bg-amber-500 transition-colors"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] bg-white rounded-md shadow-lg p-4 z-50">
          <Dialog.Close asChild>
            <Button className="absolute top-2 right-2 rounded-full hover:bg-gray-200">
              {/* Close icon */}
            </Button>
          </Dialog.Close>

          <BigCalendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '85vh', width: '85vw' }} // Fill the dialog
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};