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
}

export const CardCreator = () => {

  const { organization } = useOrganization();
    
  const { mutate } = useApiMutation(api.task.create);

  const [formData, setFormData] = useState<Task>({
    name: "",
    description: "",
    type: "",
    assignedTo: "",
    selectType: "", // Initialize with an empty string
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
    console.log(formData);
    if (!organization) {
      return
    }
    console.log("organizationId", organization.id)
    mutate ({
      orgId: organization.id,
      title: formData.name,
      description: formData.description,
    }).then((id) => {
      toast.success("Tasks created");
    })
    .catch(() => toast.error("Failed to create Task"));
  };

    return (
        <div className="flex justify-center items-center h-full">
        <Card className="w-[350px]">
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
                    id="name" 
                    placeholder="Name of the client" 
                    value={formData.name}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                  id="description" 
                  placeholder="Description of the order" 
                  rows={3} 
                  value={formData.description}
                  onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="type">Category</Label>
                  <Input 
                  id="type" 
                  placeholder="Category" 
                  value={formData.type}
                  onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="selectType">Types</Label>
                  <Select
                  onValueChange={(value) => setFormData((prevData) => ({ ...prevData, selectType: value }))} // Update formData on select change
                  value={formData.selectType} // Set initial value
                >
                    <SelectTrigger id="types">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="groupwork">Group work</SelectItem>
                      <SelectItem value="funtime">Fun time</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="assignedTo">Assigned to</Label>
                  <Input 
                  id="assignedTo" 
                  placeholder="Select"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  />
                </div>
                </div>
              </div>
              <Button variant="outline">Cancel</Button>
            <Button type="submit">Create task</Button>
            </form>
          </CardContent>
        </Card>
        
        </div>
        
      )
    }