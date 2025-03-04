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
import { OrganizationMembershipResource } from "@clerk/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  priority: initialPriority,
}: EditTaskModalProps) => {
  const { mutate, pending } = useApiMutation(api.task.update);
  const { organization } = useOrganization();
  const [memberships, setMemberships] = useState<OrganizationMembershipResource[]>([]);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [assignedTo, setAssignedTo] = useState(initialAssignedTo);
  const [priority, setPriority] = useState(initialPriority);

  useEffect(() => {
    const fetchMembers = async () => {
      if (organization) {
        const response = await organization.getMemberships();
        setMemberships(response.data);
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
        ? `${selectedMembership.publicUserData.firstName || ""} ${selectedMembership.publicUserData.lastName || ""}`
        : "";

      await mutate({
        id,
        title,
        description,
        assignedTo,
        assignedToName,
        type,
        date,
        startTime,
        endTime,
        priority,
      });
      toast.success("Task updated!");
      onClose();
    } catch (error: any) {
      toast.error(`Error updating task: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-100">Edit Task</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-gray-700 dark:text-gray-300">
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
            className="bg-gray-100 dark:bg-gray-700 border-none"
          />
          <Textarea
            disabled={pending}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            className="bg-gray-100 dark:bg-gray-700 border-none"
          />

          <Select
            disabled={pending}
            value={assignedTo}
            onValueChange={(value) => setAssignedTo(value)}
          >
            <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-none text-black dark:text-gray-100">
              <SelectValue placeholder="Select Member"/>
            </SelectTrigger>
            <SelectContent className="bg-gray-100 dark:bg-gray-700 ">
              {memberships &&
                memberships.map((membership) => (
                  <SelectItem
                    key={membership.id}
                    value={membership.publicUserData.userId ?? ""}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-gray-100"
                  >
                    {membership.publicUserData.firstName}{" "}
                    {membership.publicUserData.lastName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                disabled={pending}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Modify time"
                className="bg-gray-100 dark:bg-gray-700 border-none"
              />
            </div>
            <div className="flex-1">
              <Input
                disabled={pending}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Modify time"
                className="bg-gray-100 dark:bg-gray-700 border-none"
              />
            </div>
          </div>

          <Select value={priority} onValueChange={(value) => setPriority(value)}>
            <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-none text-black dark:text-gray-100">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100 dark:bg-gray-700">
              <SelectItem value="high" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                High
              </SelectItem>
              <SelectItem value="medium" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                Medium
              </SelectItem>
              <SelectItem value="low" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                Low
              </SelectItem>
              <SelectItem value="no-priority" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                No Priority
              </SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-none transition-colors"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={pending}
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white border-none transition-colors dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
