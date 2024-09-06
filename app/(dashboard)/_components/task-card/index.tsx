"use client";

import { Actions } from "@/components/actions";
import { Edit2Icon, MoreHorizontal } from "lucide-react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { EditTaskModal } from "@/components/edit-task-modal";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    orgId?: string;
    assignedTo?: string;
    assignedToName?: string;
    type?: string;
    authorName: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    isCompleted?: boolean;
    onToggleComplete?: (taskId: string) => void;
    hideCheckbox?: boolean;
    priority?: string;
}

export const TaskCard = ({
    id,
    title,
    description,
    createdAt,
    orgId,
    assignedTo,
    assignedToName,
    type,
    authorName,
    date,
    startTime,
    endTime,
    isCompleted = false,
    onToggleComplete,
    hideCheckbox = false,
    priority,
}: TaskCardProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString(); 

    const getPriorityColor = (priority?: string) => {
      switch (priority) {
        case "high":
          return "bg-red-500 dark:bg-red-700";
        case "medium":
          return "bg-yellow-200 dark:bg-amber-500";
        case "low":
          return "bg-green-500 dark:bg-green-700";
        default:
          return "bg-yellow-100 dark:bg-yellow-300";
      }
    };

    const toggleCompletion = useApiMutation(api.task.toggleTaskCompletion);

    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const toggleDialog = () => {
      setIsDialogOpen((prevState) => !prevState);
    };

    const handleToggleComplete = (checked: boolean) => {
      toggleCompletion.mutate({ taskId: id, isCompleted: checked});
      if (checked) {
        toast.success("Task marked as completed!");
      }
      if (onToggleComplete) {
        onToggleComplete(id);
      }
      if(!checked) {
        toast.success("Task removed from completed tasks!");
      }
    }


    return (
      <>
              <Hint
          label="Open task view"
          side="top"
          align="center"
          sideOffset={10}
        >
        <div 
          className={cn("group bg-yellow-200 dark:bg-amber-800 p-4 rounded-lg shadow-md relative border border-yellow-300 dark:border-amber-900 min-w-[200px] flex flex-col cursor-pointer min-h-[200px]",
            getPriorityColor(priority),
            {"opacity-40": isCompleted}
          )}
          > {/* Sticky note styling */}
            <div className="flex flex-col">
              {/* Tags Container */}
              <div className="flex flex-col gap-1 absolute top-2 right-2">
                <span className={`${getPriorityColor(priority)} text-black font-semibold dark:text-black dark:bg-amber-900 text-sm px-2 py-1 rounded`}>
                  Genre: {type}
                </span>
                <span className={`text-black text-sm font-semibold px-2 py-1 rounded ${getPriorityColor(priority)}`} >
                  Priority: {priority || "None"}
                </span>
              </div>

              <div className="flex flex-col flex-grow">
                <div className="pt-4">
                  <Actions
                    id={id}
                    title={title}
                    side="right"
                    description={description}
                    createdAt={createdAt}
                    assignedTo={assignedTo}
                    type={type}
                    authorName={authorName}
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                  >
                    <button className="absolute top-1 left-1 opacity group-hover:opacity-100 px-3 py-2 outline-none transition-transform duration-200 ease-in-out hover:scale-150">
                      <MoreHorizontal className="text-black opacity-75 hover:opacity-100 transition-opacity" />
                    </button>
                  </Actions>
                </div>
                <div onClick={toggleDialog}>
                  <div className="font-semibold text-2xl mb-2 dark:text-amber-300">{title}</div>
                  <div className="text-md text-black dark:text-amber-200 line-clamp-3 font-semibold">
                    {description}
                  </div>
                  {startTime && endTime && (
                    <p className="text-sm mt-2" onClick={toggleDialog}>
                      Complete between {startTime} and {endTime}
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-2 flex justify-between items-center">
                  <div className="text-xs text-amber-800 dark:text-amber-200" onClick={toggleDialog}>
                    Created by {authorName}, {formattedDate}
                  </div>
                  {!hideCheckbox && (
                    <div className="flex items-center">
                      <Checkbox
                        id={`checkbox-${id}`}
                        checked={isCompleted}
                        onCheckedChange={handleToggleComplete}
                        className="cursor-pointer"
                      />
                      <label htmlFor={`checkbox-${id}`} className="ml-2 text-sm">
                        Done
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent 
              className="bg-yellow-200 dark:bg-amber-800 rounded-lg shadow-md p-6 "
              style={{
                minHeight: "300px",
              }}
            >
            <div className="absolute top-2 right-10">
              <span className={`text-white text-xs px-2 py-1 rounded ${getPriorityColor(priority)}`}>
                Priority: {priority || "None"}
              </span>
            </div>
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-bold dark:text-amber-300">{title}</h2>
        <div className="flex items-center">
          <span className="bg-amber-800 dark:bg-amber-900 text-white dark:text-black text-xs px-2 py-1 rounded mr-2">
            Per: {assignedToName}
          </span>
          <span className="bg-amber-800 dark:bg-amber-900 text-white dark:text-black text-xs px-2 py-1 rounded">
            Genre: {type}
          </span>
        </div>
      </div>
        <p className="mb-2 text-md dark:text-amber-200">{description}</p>
        <div className="mt-auto">
        <span className="text-sm dark:text-amber-200">Date: {date}</span>
        <div className="mt-auto pt-2 flex justify-between items-center">
        <div className="text-xs text-amber-800 dark:text-amber-200">
          Created by {authorName}, {formattedDate}
        </div>
      {!hideCheckbox && (
        <div className="flex items-center">
          <Checkbox
            id={`checkbox-${id}`}
            checked={isCompleted}
            onCheckedChange={handleToggleComplete}
            className="cursor-pointer"
          />
          <label htmlFor={`checkbox-${id}`} className="ml-2 text-sm dark:text-amber-200">
            Done
          </label>
        </div>
      )}
      </div>
        {startTime && endTime && (
        <p className="text-sm mt-2 dark:text-amber-200">Complete between {startTime} and {endTime}</p>
      )}
      </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </Hint>
   </>
  );
};