"use client";

import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    orgId: string;
    assignedTo?: string;
    type?: string;
    authorName: string;
    date?: string;
}

export const TaskCard = ({
    id,
    title,
    description,
    createdAt,
    orgId,
    assignedTo,
    type,
    authorName,
    date,
}: TaskCardProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString(); 


    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleDialog = () => {
      setIsDialogOpen((prevState) => !prevState);
    };


    return (
      <>
        <div 
          className="group bg-yellow-200 p-4 rounded-lg shadow-md relative border border-yellow-300 min-w-[200px] flex flex-col cursor-pointer"
          > {/* Sticky note styling */}
    <div className="flex-grow">
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
      >
        <button 
        className="absolute top-1 left-1 opcaity-0 group-hover:opacity-100 px-3 py-2 outline-none"
        >
          <MoreHorizontal  
          className="text-black opacity-75 hover:opacity-100 transition-opacity"
          />
        </button>
      </Actions>
      </div>
      <div onClick={toggleDialog}>
      <div className="font-semibold text-2xl mb-2">{title}</div> {/* Client Name */}
        <div className="text-md text-black line-clamp-3 font-semibold"> {description} </div>
    </div>
      <div className="absolute top-0 right-0 mb-2">
        <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">Genre: {type} </span>  {/* decide for type or assignedTo */}
      </div>
      <div className="mt-6">
      </div>
      <div className="bg-amber-800 text-white text-xs px-2 py-1 rounded mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Created by {authorName}, {formattedDate}
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
            Per: {assignedTo}
          </span>
          <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">
            Genre: {type}
          </span>
        </div>
      </div>
        <p className="mb-2 text-md">{description}</p>
        <div className="mt-auto">
        <span className="text-sm">Date: {date}</span>
        <p className="text-sm mt-2">Created by {authorName}, {formattedDate}</p>
      </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
   </>
  );
};