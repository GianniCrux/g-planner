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

  // Keep or modify as you like:
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 dark:bg-red-700 text-white";
      case "medium":
        return "bg-yellow-400 dark:bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 dark:bg-green-600 text-white";
      default:
        return "bg-gray-300 dark:bg-gray-600 text-black dark:text-gray-100";
    }
  };

  const toggleCompletion = useApiMutation(api.task.toggleTaskCompletion);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen((prevState) => !prevState);
  };

  const handleToggleComplete = (checked: boolean) => {
    toggleCompletion.mutate({ taskId: id, isCompleted: checked });
    if (checked) {
      toast.success("Task marked as completed!");
    }
    if (onToggleComplete) {
      onToggleComplete(id);
    }
    if (!checked) {
      toast.success("Task removed from completed tasks!");
    }
  };

  return (
    <>
      <Hint label="Open task view" side="top" align="center" sideOffset={10}>
        <div
          className={cn(
            "group relative flex flex-col p-4 rounded-md shadow-sm border",
            "bg-white dark:bg-gray-800", 
            "border-gray-200 dark:border-gray-700",
            { "opacity-40": isCompleted }
          )}
        >
          
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            
            {type && (
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded",
                  "bg-amber-200 dark:bg-amber-700 text-black dark:text-gray-100"
                )}
              >
                Genre: {type}
              </span>
            )}
            
            <span
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded",
                getPriorityColor(priority)
              )}
            >
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
                <button className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 px-3 py-2 outline-none transition-transform duration-200 ease-in-out hover:scale-150">
                  <MoreHorizontal className="text-gray-600 dark:text-gray-300" />
                </button>
              </Actions>
            </div>

            
            <div onClick={toggleDialog} className="cursor-pointer">
              <div className="font-semibold text-xl mb-2 text-gray-800 dark:text-gray-100">
                {title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {description}
              </div>
              {startTime && endTime && (
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                  Complete between {startTime} and {endTime}
                </p>
              )}
            </div>

            
            <div className="mt-auto pt-2 flex justify-between items-center">
              <div
                className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={toggleDialog}
              >
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
                  <label
                    htmlFor={`checkbox-${id}`}
                    className="ml-2 text-sm text-gray-800 dark:text-gray-100"
                  >
                    Done
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </Hint>

      
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6",
              "border border-gray-200 dark:border-gray-700"
            )}
            style={{ minHeight: "300px" }}
          >
            
            <div className="absolute top-2 right-4">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded",
                  getPriorityColor(priority)
                )}
              >
                Priority: {priority || "None"}
              </span>
            </div>

            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {title}
              </h2>
              <div className="flex items-center gap-2">
                
                {assignedToName && (
                  <span className="bg-gray-300 dark:bg-gray-700 text-xs font-semibold px-2 py-1 rounded text-gray-800 dark:text-gray-100">
                    Per: {assignedToName}
                  </span>
                )}
                
                {type && (
                  <span className="bg-gray-300 dark:bg-gray-700 text-xs font-semibold px-2 py-1 rounded text-gray-800 dark:text-gray-100">
                    Genre: {type}
                  </span>
                )}
              </div>
            </div>

            
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
              {description}
            </p>

            
            <div className="mt-auto">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Date: {date}
              </span>

              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created by {authorName}, {formattedDate}
                </div>
                {!hideCheckbox && (
                  <div className="flex items-center">
                    <Checkbox
                      id={`checkbox-dialog-${id}`}
                      checked={isCompleted}
                      onCheckedChange={handleToggleComplete}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`checkbox-dialog-${id}`}
                      className="ml-2 text-sm text-gray-800 dark:text-gray-100"
                    >
                      Done
                    </label>
                  </div>
                )}
              </div>

              {startTime && endTime && (
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                  Complete between {startTime} and {endTime}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
