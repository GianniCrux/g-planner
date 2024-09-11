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
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/clerk-react";
import { toast } from "sonner";
import { OrganizationMembershipResource } from '@clerk/types';
import { Book } from "lucide-react";

interface Task {
_id: string;
name: string;
description: string;
type?: string;
assignedTo: string;
assignedToName: string;
date: string;
startTime?: string;
endTime?: string;
priority?: string;
}


interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
}


interface CardCreatorProps {
onClose: () => void;
}

export const CardCreator = ({ onClose }: CardCreatorProps) => {

const { organization } = useOrganization();
const [memberships, setMemberships] = useState<OrganizationMembershipResource[]>([]);
const { mutate } = useApiMutation(api.task.create);
const customers = useQuery(api.customer.get, { orgId: organization?.id ?? ''});
const [formData, setFormData] = useState<Omit<Task, "_id">>({
  name: "",
  description: "",
  type: "",
  assignedTo: "",
  assignedToName: "",
  date: "",
  startTime: "",
  endTime: "",
  priority: "no-priority",
});
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [isNewCustomer, setIsNewCustomer] = useState(false);
const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
  const fetchMembers = async () => {
    if (organization) {
      const response = await organization.getMemberships();
      setMemberships(response.data); // Extract the data property
    }
  };
  fetchMembers();
}, [organization]);

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { id, value } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [id]: value,
  }));
};

const handleCustomerSelect = (customerId: string) => {
  if (customerId === "new") {
    setSelectedCustomer(null);
    setFormData(prevData => ({ ...prevData, name: "", description: "" }));
    setIsNewCustomer(true);
  } else {
    const customer = customers?.find(c => c._id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData(prevData => ({
        ...prevData,
        name: customer.name,
        description: `Phone: ${customer.phoneNumber}\nAddress: ${customer.address}\n${prevData.description}`,
      }));
      setIsNewCustomer(false);
    }
  }
}


const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!organization) {
    return;
  }

  const selectedMembership = memberships.find(
    (membership) => membership.publicUserData.userId === formData.assignedTo
  );

  const assignedToName = selectedMembership
    ? `${selectedMembership.publicUserData.firstName || ''} ${selectedMembership.publicUserData.lastName || ''}`
    : '';

  mutate({
    orgId: organization.id,
    title: formData.name,
    description: formData.description,
    assignedTo: formData.assignedTo,
    assignedToName,
    date: formData.date,
    type: formData.type,
    startTime: formData.startTime,
    endTime: formData.endTime,
    priority: formData.priority,
  }).then(() => {
    toast.success("Tasks created");
    onClose();
  })
  .catch(() => toast.error("Failed to create Task"));
};

return (
  <div className="flex justify-center items-center h-full bg-amber-300 dark:bg-amber-600">
    <Card className="w-[300px] bg-amber-300 border-none dark:bg-amber-800">
      <CardHeader>
        <CardTitle className="text-xl text-black dark:text-amber-300">Create Tasks</CardTitle>
        <CardDescription className="text-sm text-black dark:text-amber-200">
          Write here your new task, it will be added to your schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
          <div className="flex flex-col">
                <Label htmlFor="name">Name</Label>
                {isNewCustomer ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" className="p-1" onClick={() => setIsNewCustomer(false)}>
                      <Book className="h-5 w-5" />
                    </Button>
                    <Input 
                      className="bg-amber-200 dark:bg-amber-600 border-none !placeholder-black"
                      id="name" 
                      placeholder="Name of the client" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <Select
                    value={selectedCustomer?._id ?? (isNewCustomer ? 'new' : '')}
                    onValueChange={handleCustomerSelect}
                  >
                    <SelectTrigger className="bg-amber-200 dark:bg-amber-600 border-none">
                      <SelectValue placeholder="Select Customer or type new name" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-200 dark:bg-amber-600 border-none">
                      <SelectItem 
                        value="new"
                        className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700"
                      >Type new name</SelectItem>
                      {customers?.map((customer) => (
                        <SelectItem 
                          key={customer._id} 
                          value={customer._id}
                          className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700"
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            <div className="flex flex-col">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                className="bg-amber-200 dark:bg-amber-600 border-none !placeholder-black"
                id="description" 
                placeholder="Description of the order" 
                rows={3} 
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="type">Type of order</Label>
              <Input 
                className="bg-amber-200 dark:bg-amber-600 border-none !placeholder-black"
                id="type" 
                placeholder="Category" 
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="assignedTo">Assigned to</Label>
              <Select 
                value={formData.assignedTo}
                onValueChange={(value) => setFormData(prevData => ({ ...prevData, assignedTo: value }))}
              >
                <SelectTrigger className="bg-amber-200 dark:bg-amber-600 border-none">
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent className="bg-amber-200 dark:bg-amber-600  border-none">
                  {memberships && memberships.map((membership) => (
                    <SelectItem 
                      key={membership.id} 
                      value={membership.publicUserData.userId ?? ''}
                      className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700"
                    >
                      {membership.publicUserData.firstName} {membership.publicUserData.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="date">Date</Label>
              <Input
                className="bg-amber-200 dark:bg-amber-600 border-none"
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 w-20"> 
                <Label htmlFor="startTime">Start Time (Optional)</Label>
                <Input
                  className="bg-amber-200 dark:bg-amber-600 h-8 border-none"
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 w-20"> 
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  className="bg-amber-200 dark:bg-amber-600 h-8 border-none"
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 w-20">
              <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prevData) => ({ ...prevData, priority: value }))}
                >
                  <SelectTrigger className="bg-amber-200 dark:bg-amber-600 border-none">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-200 dark:bg-amber-600  border-none">
                    <SelectItem value="high" className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700">
                      High Priority
                    </SelectItem>
                    <SelectItem value="medium" className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700">
                      Medium Priority
                    </SelectItem>
                    <SelectItem value="low" className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700">
                      Low Priority
                    </SelectItem>
                    <SelectItem value="none" className="bg-amber-200 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700">
                      No Priority
                    </SelectItem>
                  </SelectContent>
                </Select>
                </div>
            </div>
          </div>
          <div className="flex pt-2 space-x-2 justify-between">
            <Button variant="outline" className="bg-amber-200 hover:bg-amber-600 border-none dark:bg-amber-600 dark:hover:bg-amber-600" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-amber-200 hover:bg-amber-600 text-black border-none dark:bg-amber-600 dark:text-amber-400 dark:hover:bg-amber-600">Create task</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
)
}
