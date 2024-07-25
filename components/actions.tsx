"use client";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";


import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
import { Edit2Icon, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";
import { EditTaskModal } from "./edit-task-modal";
import { useState } from "react";
 



interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
    description: string;
    createdAt: number;
    assignedTo?: string;
    assignedToName?: string;
    type?: string;
    authorName: string;
    date?: string;
    startTime?: string;
    endTime?: string;
}

export const Actions = ({
    children,
    side,
    sideOffset,
    id,
    title,
    description,
    createdAt,
    assignedTo,
    assignedToName,
    type,
    authorName,
    date,
    startTime,
    endTime,
}: ActionsProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    const { mutate: deleteTask, pending } = useApiMutation(api.task.remove);

    const [isEditing, setIsEditing] = useState(false);

    const handleDeleteTask = () => {
        deleteTask({ id })
            .then(() => {
                toast.success("Task deleted");
            })
            .catch(() => toast.error("Failed to delete task"));
    }

    const copyTaskText = async () => {
        const taskText =`
        Title: ${title}
        Description: ${description}
        Assigned To: ${assignedToName}
        Type: ${type}
        Date: ${date}
        Created by: ${authorName} on ${formattedDate}
        To complete between ${startTime} and ${endTime}
    `;
        try {
            await navigator.clipboard.writeText(taskText);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
};


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                sideOffset={sideOffset}
                className="w-60 bg-amber-300 dark:bg-amber-600"
            >
                <Button
                    onClick={() => 
                        copyTaskText()
                            .then(() => toast.success("Text copied to clipboard"))
                            .catch(() => toast.error("Failed to copy the text"))
                    }
                    className="p-3 cursor-pointer bg-transparent text-sm w-full justify-start font-normal hover:bg-amber-600 dark:hover:bg-amber-800 text-black"
                >
                    <Link2 
                        className="h-4 w-4 mr-2"
                    />
                    Copy task text
                </Button>
                    <ConfirmModal
                        header="Delete Task?"
                        description="This will delete the task and all of its content"
                        disabled={pending}
                        onConfirm={handleDeleteTask}
                    >
                        <Button className="bg-transparent text-sm w-full justify-start font-normal hover:bg-amber-600 dark:hover:bg-amber-800 text-black">
                        <Trash2 
                            className="h-4 w-4 mr-2"
                        />
                        Delete task
                        </Button>
                    </ConfirmModal>
                    {isEditing && (
        <EditTaskModal 
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            id={id}
            title={title}
            description={description} 
            createdAt={createdAt}
            assignedTo={assignedTo}
            assignedToName={assignedToName}
            type={type}
            authorName={authorName}
            date={date}
            startTime={startTime}
            endTime={endTime}
    /> 
        )}
        <Button 
          onClick={() => setIsEditing(true)}
          className="p-3 cursor-pointer bg-transparent text-sm w-full justify-start font-normal hover:bg-amber-600 dark:hover:bg-amber-800y text-black"
        >
          <Edit2Icon className="h-4 w-4 mr-2" /> Edit Task
        </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}