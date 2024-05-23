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
import { useState } from "react";


interface Task {
  name: string;
  description: string;
  type: string;
  assignedTo: string;
  selectType: string; // Added for the select dropdown
}

export const CardCreator = () => {
  const [formData, setFormData] = useState<Task>({
    name: "",
    description: "",
    type: "",
    assignedTo: "",
    selectType: "", // Initialize with an empty string
  });

  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);

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
    setCreatedTasks([...createdTasks, formData]);
    setFormData({
      name: "",
      description: "",
      type: "",
      assignedTo: "",
      selectType: "",
    });
  };

    return (
        <div className="flex justify-center items-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>New order</CardTitle>
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
        <div>
        {createdTasks.map((task, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Description: {task.description}</p>
              <p>Category: {task.type}</p>
              <p>Assigned to: {task.assignedTo}</p>
              <p>Type: {task.selectType}</p> {/* Display the selected type */}
            </CardContent>
          </Card>
        ))}
        </div>
        </div>
        
      )
    }