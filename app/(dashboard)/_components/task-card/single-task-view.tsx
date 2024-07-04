import { Actions } from "@/components/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";


interface SingleTaskViewProps {
    task: {
      _id: string;
      _creationTime: number; 
      title: string;
      description: string;
      orgId: string;
      assignedTo?: string;
      assignedToName?: string;
      authorId: string;
      authorName: string;
      date?: string;
      type?: string;
      startTime?: string;
      endTime?: string;
      isCompleted?: boolean;
    };
  }
  

export const SingleTaskView = ({ task }: SingleTaskViewProps) => {

  const toggleCompletion = useApiMutation(api.task.toggleTaskCompletion);

  const handleToggleComplete = (checked: boolean) => {
    toggleCompletion.mutate({ taskId: task._id, isCompleted: checked });
    if (checked) {
      toast.success("Task marked as completed!");
    } else {
      toast.success("Task removed from completed tasks!");
    }
  };
    
    return (
        <div className="min-h-[calc(95vh-64px)] sm:min-h-[calc(95vh-56px)] max-h-screen[95vh] bg-yellow-200 rounded-lg shadow-md p-6 mb-8">
      <div>
      <Actions 
        id={task._id}
        title={task.title}
        side="right"
        description={task.description}
        createdAt={task._creationTime}
        assignedTo={task.assignedTo}
        assignedToName={task.assignedToName}
        type={task.type}
        authorName={task.authorName}
        date={task.date}
        startTime={task.startTime}
        endTime={task.endTime}
      >
        <button
          className="opacity group-hover:opacity-100 px-3 py-2 outline-none transition-transform duration-200 ease-in-out hover:scale-150"
        >
          <MoreHorizontal
            className="text-black opacity-75 hover:opacity-100 transition-opacity"
          />
        </button>
      </Actions>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <span className="text-gray-500">{task.date}</span>
      </div>
      <p className="text-black mb-4">{task.description}</p>
      <div className="flex items-center">
          <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded mr-2">
            Per: {task.assignedToName}
          </span>
          <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">
            Genre: {task.type}
          </span>
        </div>
      <div className="mt-4">
        <span className="text-gray-500 mr-2">Created by:</span>
        <span className="text-gray-700">{task.authorName}</span>
        {task.startTime && task.endTime && (
        <p className="text-sm text-gray-500 mt-2">Complete between {task.startTime}, {task.endTime}</p>
        )}
      </div>
      <div className="flex items-center">
          <Checkbox
            id={`checkbox-${task._id}`}
            checked={task.isCompleted}
            onCheckedChange={handleToggleComplete}
            className="cursor-pointer"
          />
          <label htmlFor={`checkbox-${task._id}`} className="ml-2 text-sm">
            Done
          </label>
        </div>
    </div>
    )
}