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

    const [showDialog, setShowDialog] = useState(false);
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [isCardView, setIsCardView] = useState(false);

    const toggleDialog = () => {
        setShowDialog((prevState) => !prevState);
    };

    const handleViewChange = () => {
        setIsCalendarView((prevState) => !prevState);
        setIsCardView(false); 
    }

    const toggleCardView = () => {
      setIsCardView((prevState) => !prevState);
    }
    

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
              <h2 className="text-xl sm:text-md">{query.personal ? "Personal tasks" : "Team tasks"}</h2>
            <div className="flex space-x-1">
            {isCardView && (
              <Button onClick={toggleDialog} className="bg-amber-300 text-black hover:bg-amber-600/20">
                <Plus className="h-w w-4" /> Add task
              </Button>
            )}
            {!isCalendarView && (
              <Button 
                onClick={toggleCardView} 
                variant={isCardView ? "secondary" : "ghost"} 
                className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-800"
                >
                {isCardView ? <GalleryVertical className="h-w w-4"/> : <GalleryHorizontal className="h-4 w-4"/>}
                <span className="hidden lg:inline">
                {isCardView ? "Grid View" : "Card View"}
                </span>
              </Button>
            )}
              <Button 
                onClick={handleViewChange} 
                variant={isCalendarView ? "secondary" : "ghost"} 
                className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-800"
                >
                {isCalendarView ? <List className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                <span className="hidden lg:inline">
                {isCalendarView ? "Task List View" : "Calendar View"}
                </span>
              </Button>
            </div>
            {showDialog && (
            <Dialog open={showDialog} onOpenChange={toggleDialog}>
            <DialogContent className="bg-amber-400">
              <CardCreator onClose={toggleDialog} />
            </DialogContent>
          </Dialog>
            )}
          </div>
          {isCalendarView ? (
            <CalendarTask tasks={data} />
          ) : isCardView ? (
            data.map((task) =>  <SingleTaskView key={task._id} task={task} />)
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <div className="flex justify-end mb-4">
                  <Button onClick={toggleDialog} className="h-full w-full bg-yellow-200 text-black hover:bg-amber-500">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                  {showDialog && (
                    <Dialog open={showDialog} onOpenChange={toggleDialog}>
                      <DialogContent className="bg-amber-400">
                        <CardCreator onClose={toggleDialog} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                {data?.map((task) => (
                  <TaskCard
                    key={task._id}
                    id={task._id}
                    title={task.title}
                    description={task.description}
                    assignedTo={task.assignedTo}
                    createdAt={task._creationTime}
                    orgId={task.orgId}
                    authorName={task.authorName}
                    date={task.date}
                    type={task.type}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      );
    };