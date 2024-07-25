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

import { useOrganization } from "@clerk/clerk-react";
import { OrganizationMembershipResource } from '@clerk/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
    assignedTo: initialAssignedTo,
    assignedToName,
    type,
    date,
    startTime: initialStartTime,
    endTime: initialEndTime,
}: EditTaskModalProps) => {
    const { mutate, pending } = useApiMutation(api.task.update);
    const { organization } = useOrganization();
    const [memberships, setMemberships] = useState<OrganizationMembershipResource[]>([]);

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState(initialEndTime);
    const [assignedTo, setAssignedTo] = useState(initialAssignedTo);


    useEffect(() => {
      const fetchMembers = async () => {
          if (organization) {
              const response = await organization.getMemberships();
              setMemberships(response.data); // Extract the data property
          }
      };

      fetchMembers();
  }, [organization]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
          const selectedMembership = memberships.find(
            (membership) => membership.publicUserData.userId === assignedTo
        );

        const assignedToName = selectedMembership
            ? `${selectedMembership.publicUserData.firstName || ''} ${selectedMembership.publicUserData.lastName || ''}`
            : '';

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
          <DialogContent className="bg-amber-300 dark:bg-amber-600 border-none">
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
                className="bg-amber-200 dark:bg-amber-500 border-none"
              />
              <Textarea
                disabled={pending}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="bg-amber-200 dark:bg-amber-500 border-none"
              />
                  <Select
                  disabled={pending}
                 value={assignedTo}
                onValueChange={(value) => setAssignedTo(value)}
    >
        <SelectTrigger className="bg-amber-200 dark:bg-amber-500 border-none">
            <SelectValue placeholder="Select Member" />
        </SelectTrigger>
        <SelectContent className="bg-amber-200 dark:bg-amber-500 ">
            {memberships &&
                memberships.map((membership) => (
                    <SelectItem
                        key={membership.id}
                        value={membership.publicUserData.userId ?? ''}
                        className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-500 dark:hover:bg-amber-700"
                    >
                        {membership.publicUserData.firstName}{' '}
                        {membership.publicUserData.lastName}
                    </SelectItem>
                ))}
        </SelectContent>
    </Select>
            <div className="flex space-x-2">
            <div className="flex-1 w-24"> 
              <Input 
                disabled={pending}
                required
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Modify time"
                className="bg-amber-200 dark:bg-amber-500 border-none"
              />
              </div>
              <div className="flex-1 w-24">
              <Input 
                disabled={pending}
                required
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Modify time"
                className="bg-amber-200 dark:bg-amber-500 border-none"
              />
              </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="bg-amber-500 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-700 border-none">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={pending} type="submit" className="bg-amber-500 hover:bg-amber-700 text-black dark:bg-amber-500 dark:hover:bg-amber-700 border-none">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    )
}