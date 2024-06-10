"use client";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";


import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
import { Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
 



interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
    description: string;
    createdAt: number;
    assignedTo?: string;
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
    type,
    authorName,
    date,
    startTime,
    endTime,
}: ActionsProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    const { mutate: deleteTask, pending } = useApiMutation(api.task.remove);

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
        Assigned To: ${assignedTo}
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
                className="w-60 bg-amber-300"
            >
                <DropdownMenuItem 
                    onClick={() => 
                        copyTaskText()
                            .then(() => toast.success("Text copied to clipboard"))
                            .catch(() => toast.error("Failed to copy the text"))
                    }
                    className="p-3 cursor-pointer bg-amber-300 data-[state=open]:bg-amber-600"
                >
                    <Link2 
                        className="h-4 w-4 mr-2"
                    />
                    Copy task text
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="p-3 cursor-pointer bg-amber-300 data-[state=open]:bg-amber-600"
                    onClick={handleDeleteTask}
                    disabled={pending}
                >
                    <Trash2 
                        className="h-4 w-4 mr-2"
                    />
                    Delete task
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}