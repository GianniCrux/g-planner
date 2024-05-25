import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "./ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/clerk-react";
import { toast } from "sonner";


interface Task {
  name: string;
  description: string;
  type: string;
  assignedTo: string;
  selectType: string; // Added for the select dropdown
  date: string;
}

interface CardCreatorProps {
  onClose: () => void;
}

export const CardCreator = ({ onClose }: CardCreatorProps) => {

  const { organization } = useOrganization();
    
  const { mutate } = useApiMutation(api.task.create);

  const [formData, setFormData] = useState<Task>({
    name: "",
    description: "",
    type: "",
    assignedTo: "",
    selectType: "", // Initialize with an empty string
    date: "",
  });



  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organization) {
      return
    }
    mutate ({
      orgId: organization.id,
      title: formData.name,
      description: formData.description,
      assignedTo: formData.assignedTo,
      date: formData.date,
    }).then((id) => {
      toast.success("Tasks created");
      onClose();
    })
    .catch(() => toast.error("Failed to create Task"));
  };

    return (
        <div className="flex justify-center items-center h-full bg-amber-200">
        <Card className="w-[350px] bg-amber-200">
          <CardHeader>
            <CardTitle>Create Tasks</CardTitle>
            <CardDescription>Write here your new task, it will be added to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    className="bg-amber-200"
                    id="name" 
                    placeholder="Name of the client" 
                    value={formData.name}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                  className="bg-amber-200"
                  id="description" 
                  placeholder="Description of the order" 
                  rows={3} 
                  value={formData.description}
                  onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="type">Type of order</Label>
                  <Input 
                  className="bg-amber-200"
                  id="type" 
                  placeholder="Category" 
                  value={formData.type}
                  onChange={handleChange}
                  />
                </div>
                  <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="assignedTo">Assigned to</Label>
                  <Input 
                  className="bg-amber-200"
                  id="assignedTo" 
                  placeholder="Select"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    className="bg-amber-200"
                    id="date"
                    type="date" // Use the date input type
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="pt-4">
              <Button variant="outline" className="m-4" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create task</Button>
            </div>
            </form>
          </CardContent>
        </Card>
        
        </div>
        
      )
    }