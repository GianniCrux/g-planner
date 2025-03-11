"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDaysIcon, CalendarFold } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { TaskCard, TaskCardProps } from "./task-card";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useProject } from "../contexts/ProjectContext";


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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "work_week" | "agenda">("month");
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [showAllProjects, setShowAllProjects] = useState(false);

  
  const { selectedProject } = useProject();

  useEffect(() => {

    const filteredTasks = (!showAllProjects && selectedProject)
      ? tasks.filter((task) => task.projectId === selectedProject && !task.isCompleted)
      : tasks.filter((task) => !task.isCompleted);

    const calendarEvents: CalendarEvent[] = filteredTasks.map((task) => {
      const baseDate = new Date(task.date);
      let startDate, endDate;

      if (task.startTime && task.endTime) {
        const [startHour, startMinute] = task.startTime.split(":").map(Number);
        const [endHour, endMinute] = task.endTime.split(":").map(Number);


        const startD = new Date(baseDate);
        startD.setHours(startHour, startMinute, 0);
        startDate = startD;

        const endD = new Date(baseDate);
        endD.setHours(endHour, endMinute, 0);
        endDate = endD;
      } else {

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
  }, [tasks, showAllProjects, selectedProject]);

  const handleSelectSlot = ({ start }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    const selectedDateEvents = events.filter(
      (event) => moment(event.start).isSame(moment(start), "day") && !event.isCompleted
    );
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
      if (prevView === "month") return "week";
      if (prevView === "week") return "day";
      if (prevView === "day") return "month";
      return "month";
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "#f87171";
      case "medium":
        return "#fbbf24";
      case "low":
        return "#34d399";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div className="relative p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-lg rounded-md">
      <div className="flex items-center mb-4">
        <Checkbox
          id="showAllProjects"
          checked={showAllProjects}
          onCheckedChange={(checked) => setShowAllProjects(checked as boolean)}
          className="mr-2"
        />
        <label htmlFor="showAllProjects" className="text-sm">
          Show tasks from any project
        </label>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span>
          <Button
            onClick={handleViewChange}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Hint
              label={
                currentView === "month"
                  ? "Month View"
                  : currentView === "week"
                  ? "Week View"
                  : "Day View"
              }
              side="right"
              align="center"
              sideOffset={10}
            >
              {currentView === "month" ? (
                <CalendarFold />
              ) : currentView === "week" ? (
                <CalendarDaysIcon />
              ) : (
                <Calendar />
              )}
            </Hint>
            <span className="hidden sm:inline">
              {currentView === "month"
                ? "Month"
                : currentView === "week"
                ? "Week"
                : "Day"}
            </span>
          </Button>
        </span>
      </div>

      <BigCalendar
        onSelectEvent={handleSelectSlot}
        selectable
        localizer={localizer}
        events={events}
        toolbar={true}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh", width: "100%" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: getPriorityColor(event.priority),
            color: "#1f2937",
            fontSize: "12px",
          },
        })}
        view={currentView}
        components={{
          toolbar: ({ label, onNavigate }) => (
            <div className="rbc-toolbar flex justify-between items-center mb-2">
              <span className="rbc-toolbar-label text-base font-semibold">
                {label}
              </span>
              <div className="rbc-btn-group flex items-center space-x-2">
                <Button variant="outline" onClick={() => onNavigate("TODAY")}>
                  Today
                </Button>
                <Button variant="outline" onClick={() => onNavigate("PREV")}>
                  Back
                </Button>
                <Button variant="outline" onClick={() => onNavigate("NEXT")}>
                  Next
                </Button>
              </div>
            </div>
          ),
          header: ({ label }) => (
            <div className="rbc-day-header text-sm font-medium text-gray-600 dark:text-gray-300">
              {label}
            </div>
          ),
        }}
        date={currentMonth.toDate()}
        onView={(view) => setCurrentView(view)}
        onNavigate={(newDate) => setCurrentMonth(moment(newDate))}
        dayPropGetter={(date) => {
          const isCurrentMonth = date.getMonth() === currentMonth.month();
          const isToday = moment().isSame(date, "day");
          return {
            className: cn(
              "rbc-day-bg",
              isToday
                ? "bg-gray-100 dark:bg-gray-700"
                : isCurrentMonth
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-gray-200 dark:bg-gray-700 opacity-70"
            ),
          };
        }}
      />

      <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

      {showDialog && selectedDate && (
        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
          <DialogContent
            className="bg-white dark:bg-gray-800 max-h-[600px] overflow-auto border border-gray-200 dark:border-gray-700"
          >
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map((task) => (
                <TaskCard key={task._id} {...task} hideCheckbox={true} />
              ))
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-200">
                No tasks available for the selected date.
              </p>
            )}
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
