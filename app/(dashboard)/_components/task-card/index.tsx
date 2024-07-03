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
}: TaskCardProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString(); 
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
        toast.success("Task removed");
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
          className={cn("group bg-yellow-200 p-4 rounded-lg shadow-md relative border border-yellow-300 min-w-[200px] flex flex-col cursor-pointer min-h-[200px]",
            {"opacity-40": isCompleted}
          )}
          > {/* Sticky note styling */}
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
        <button 
        className="absolute top-1 left-1 opacity group-hover:opacity-100 px-3 py-2 outline-none transition-transform duration-200 ease-in-out hover:scale-150"
        >
          <MoreHorizontal  
          className="text-black opacity-75 hover:opacity-100 transition-opacity"
          />
        </button>
      </Actions>
    </div>
      <div>
      <div className="font-semibold text-2xl mb-2">{title}</div> {/* Client Name */}
        <div className="text-md text-black line-clamp-3 font-semibold"> {description} </div>
        {startTime && endTime && (
        <p className="text-sm mt-2">Complete between {startTime} and {endTime}</p>
      )}
    </div>
      <div className="absolute top-0 right-0 mb-2">
        <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">Genre: {type} </span>  {/* decide for type or assignedTo */}
      </div>
      <div className="mt-auto pt-2 flex justify-between items-center">
  <div className="text-xs text-amber-800">
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
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent 
              className="bg-yellow-200 rounded-lg shadow-md p-6 "
              style={{
                minHeight: "300px",
              }}
            >
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center">
          <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded mr-2">
            Per: {assignedToName}
          </span>
          <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">
            Genre: {type}
          </span>
        </div>
      </div>
        <p className="mb-2 text-md">{description}</p>
        <div className="mt-auto">
        <span className="text-sm">Date: {date}</span>
        <div className="mt-auto pt-2 flex justify-between items-center">
        <div className="text-xs text-amber-800">
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
        {startTime && endTime && (
        <p className="text-sm mt-2">Complete between {startTime} and {endTime}</p>
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