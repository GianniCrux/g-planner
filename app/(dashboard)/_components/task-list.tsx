"use client";



import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CardCreator } from "@/components/card";
import { EmptySearch } from "./empty-search";
import { EmptyPersonal } from "./empty-personal";
import { EmptyTask } from "./empty-task";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar, GalleryHorizontal, GalleryVertical, List, Plus } from "lucide-react";
import { TaskCard } from "./task-card";
import { useState } from "react";

import { 
    Dialog, 
    DialogContent,
} from "@/components/ui/dialog";
import { Loading } from "@/components/auth/loading";
import { CalendarTask } from "./calendar-task";
import { SingleTaskView } from "./task-card/single-task-view";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskListProps {
    orgId: string;
    query: {
        search?: string;
        personal?: string;
        [key: string]: string | undefined;
    };
};


export const TaskList = ({
    orgId,
    query,
}: TaskListProps) => {
    const data = useQuery(api.tasks.get, { orgId });
    const { user } = useUser();

    const [showDialog, setShowDialog] = useState(false);
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [columns, setColumns] = useState(1);



    const toggleDialog = () => {
        setShowDialog((prevState) => !prevState);
    };

    const handleViewChange = () => {
        setIsCalendarView((prevState) => !prevState);
    }

    
    const handleColumnsChange = (value: string) => {
      setColumns(parseInt(value, 10));
    };

    const getGridClass = () => {
      switch (columns) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-2";
        case 3:
          return "grid-cols-3";
        case 4:
          return "grid-cols-4";
        case 5:
          return "grid-cols-5";
        default:
          return "grid-cols-4"; 
      }
    };

    if (data === undefined) { //data can never be undefined regardless there's an error or it's empty
        return (
            <div>
                <Loading />
            </div>
        )
    }

    if (!data?.length && query.search) { //if we don't have data length but we have query.search it means that data is empty cause the user searched for something that doesn exists
        return (
            <EmptySearch />
        );
    };

    if (!data?.length && query.personal) {
        return (
            <EmptyPersonal />
        );
    } 

    if (!data?.length) {
        return (
            <EmptyTask />
        )
    }


    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-md pt-3 dark:text-amber-200">
            {query.personal ? "Personal tasks" : "Team tasks"}
          </h2>
  
          <div className="flex space-x-1">
          <Button
              onClick={toggleDialog}
              className="bg-amber-300 text-black hover:bg-amber-600/20 dark:bg-amber-700 dark:text-black dark:hover:bg-amber-800"
            >
              <Plus className="h-w w-4" /> Add Task
            </Button>


            <Select onValueChange={handleColumnsChange}>
              <SelectTrigger className="w-32 bg-amber-500 border-none">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Single View</SelectItem>
                <SelectItem value="2">2 Cards</SelectItem>
                <SelectItem value="3">3 Cards</SelectItem>
                <SelectItem value="4">4 Cards</SelectItem>
                <SelectItem value="5">5 Cards</SelectItem>
              </SelectContent>
            </Select>
  
            <Button
              onClick={handleViewChange}
              variant={isCalendarView ? "secondary" : "ghost"}
              className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              {isCalendarView ? (
                <Plus className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span className="hidden lg:inline">
                {isCalendarView ? "Task List View" : "Calendar View"}
              </span>
            </Button>

          </div>
        </div>
  


        {isCalendarView ? (
        <CalendarTask tasks={data} />
      ) : (
        <div className={`grid gap-5 mt-8 pb-10 ${getGridClass()}`}>
          {data
            ?.filter((task) => {
              if (query.personal === "true" && user) {
                return task.assignedTo === user.id;
              }
              return query.search
                ? task.title.toLowerCase().includes(query.search.toLowerCase()) ||
                  task.description.toLowerCase().includes(query.search.toLowerCase()) ||
                  task.assignedToName?.toLowerCase().includes(query.search.toLowerCase())
                : true;
            })
            .map((task) => (
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
          <DialogContent className="bg-amber-400 dark:bg-amber-800 border-none">
            <CardCreator onClose={toggleDialog}/>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};