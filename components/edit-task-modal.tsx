"use client";

import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { FormEventHandler, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { TaskCardProps } from "@/app/(dashboard)/_components/task-card";
import { Textarea } from "./ui/textarea";

interface EditTaskModalProps extends TaskCardProps {
    isOpen: boolean;
    onClose: () => void;
}


export const EditTaskModal = ({
    id,
    title: initialTitle,
    description: initialDescription,
    isOpen,
    onClose,
    assignedTo,
    assignedToName,
    type,
    date,
    startTime: initialStartTime,
    endTime: initialEndTime,
}: EditTaskModalProps) => {
    const { mutate, pending } = useApiMutation(api.task.update);

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [startTime, setStartTime] = useState(initialDescription);
    const [endTime, setEndTime] = useState(initialDescription);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await mutate({ id, title, description, assignedTo, assignedToName, type, date, startTime, endTime}); 
            toast.success("Task updated!");
            onClose();
        } catch (error: any) {  // Explicitly type error as any
            toast.error(`Error updating task: ${error.message}`);
            console.error(error);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-amber-300">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-black">
              Make changes to your task.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                disabled={pending}
                required
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                className="bg-amber-200"
              />
              <Textarea
                disabled={pending}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="bg-amber-200"
              />
              <Input 
                disabled={pending}
                required
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Modify time"
                className="bg-amber-200"
              />
              <Input 
                disabled={pending}
                required
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Modify time"
                className="bg-amber-200"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="bg-amber-500 hover:bg-amber-700">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={pending} type="submit" className="bg-amber-500 hover:bg-amber-700 text-black">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    )
}