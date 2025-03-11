"use client";

import { CardCreator } from "@/components/card";
import { Button } from "@/components/ui/button";
import { EmptySearch } from "./empty-search";
import { EmptyPersonal } from "./empty-personal";
import { EmptyTask } from "./empty-task";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar, List, Plus } from "lucide-react";
import { TaskCard } from "./task-card";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loading } from "@/components/auth/loading";
import { CalendarTask } from "./calendar-task";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "../contexts/ProjectContext";

interface TaskListProps {
  orgId: string;
  query: {
    search?: string;
    personal?: string;
    [key: string]: string | undefined;
  };
}

export const TaskList = ({ orgId, query }: TaskListProps) => {
  const { selectedProject } = useProject();
  const data = useQuery(api.tasks.get, { orgId });
  const { user } = useUser();

  const [showDialog, setShowDialog] = useState(false);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [selectedCards, setSelectedCards] = useState("1");

  const toggleDialog = () => {
    setShowDialog((prevState) => !prevState);
  };

  const handleViewChange = () => {
    setIsCalendarView((prevState) => !prevState);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSelectedCards("3");
    } else if (window.innerWidth < 1024) {
      setSelectedCards((prev) =>
        prev === "4" || prev === "5" ? "3" : prev
      );
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleColumnsChange = (value: string) => {
    setSelectedCards(value);
  };

  const getGridClass = () => {
    switch (selectedCards) {
      case "1":
        return "grid-cols-1";
      case "2":
        return "grid-cols-2";
      case "3":
        return "grid-cols-3";
      case "4":
        return "grid-cols-4";
      case "5":
        return "grid-cols-5";
      default:
        return "grid-cols-4";
    }
  };

  if (data === undefined) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.personal) {
    return <EmptyPersonal />;
  }

  if (!data?.length) {
    return <EmptyTask />;
  }

  const filteredTasks = selectedProject
    ? data.filter((task) => task.projectId === selectedProject)
    : data.filter((task) => {
        if (query.personal === "true" && user) {
          return task.assignedTo === user.id;
        }
        if (query.search) {
          const searchTerm = query.search.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            (task.assignedToName &&
              task.assignedToName.toLowerCase().includes(searchTerm))
          );
        }
        return true;
      });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-md pt-4 text-gray-800 dark:text-gray-100">
          {query.personal ? "Personal tasks" : "Team tasks"}
        </h2>

        <div className="flex space-x-1">
          <Button
            onClick={toggleDialog}
            className="bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>

          {!isCalendarView && (
            <Select onValueChange={handleColumnsChange} value={selectedCards}>
              <SelectTrigger className="w-32 bg-amber-500 dark:bg-amber-600 border border-gray-300 text-white dark:text-gray-100">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border border-gray-300 text-black dark:text-gray-100">
                <SelectItem value="1">Single View</SelectItem>
                <SelectItem value="2">2 Cards</SelectItem>
                <SelectItem value="3">3 Cards</SelectItem>
                <SelectItem value="4" className="hidden lg:block">
                  4 Cards
                </SelectItem>
                <SelectItem value="5" className="hidden lg:block">
                  5 Cards
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleViewChange}
            variant={isCalendarView ? "secondary" : "ghost"}
            className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            {isCalendarView ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4 text-white mr-1" />}
            <span className="hidden lg:inline text-white dark:text-gray-100">
              {isCalendarView ? "Task List View" : "Calendar View"}
            </span>
          </Button>
        </div>
      </div>

      {isCalendarView ? (
        <CalendarTask tasks={data} />
      ) : (
        <div className={`grid gap-5 mt-8 pb-10 ${getGridClass()}`}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              id={task._id}
              title={task.title}
              description={task.description}
              assignedTo={task.assignedTo}
              assignedToName={task.assignedToName}
              createdAt={task._creationTime}
              orgId={task.orgId}
              authorName={task.authorName}
              date={task.date}
              type={task.type}
              startTime={task.startTime}
              endTime={task.endTime}
              isCompleted={task.isCompleted}
              priority={task.priority}
            />
          ))}
        </div>
      )}

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={toggleDialog}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <CardCreator onClose={toggleDialog} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
