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
import { Book, ArrowLeft, ArrowRight, Check } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Omit<Task, "_id">>({
    name: "",
    description: "",
    type: "",
    assignedTo: "",
    assignedToName: "",
    date: "",
    startTime: "",
    endTime: "",
    priority: "none",
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (organization) {
        const response = await organization.getMemberships();
        setMemberships(response.data);
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
      setFormData(prevData => ({ ...prevData, name: ""}));
      setIsNewCustomer(true);
    } else {
      const customer = customers?.find(c => c._id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData(prevData => ({
          ...prevData,
          name: customer.name
        }));
        setIsNewCustomer(false);
      }
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
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
      customerId: selectedCustomer?._id,
    }).then(() => {
      toast.success("Task created");
      onClose();
    })
    .catch(() => toast.error("Failed to create Task"));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return formData.type !== "" && formData.assignedTo !== "";
      case 3:
        return formData.date !== "";
      default:
        return false;
    }
  };


  const ProgressBar = () => (
    <div className="flex justify-between items-center mb-4 px-1">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
              ${currentStep === step 
                ? "bg-amber-500 text-white" 
                : currentStep > step 
                  ? "bg-amber-400 text-white" 
                  : "bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-300"}`}
          >
            {currentStep > step ? <Check size={16} /> : step}
          </div>
          <div className="text-xs text-center text-black dark:text-amber-300">
            {step === 1 ? "Client" : step === 2 ? "Details" : "Schedule"}
          </div>
        </div>
      ))}
      <div className="h-1 bg-amber-200 dark:bg-amber-700 absolute w-[60%] top-4 left-[20%] -z-10"></div>
    </div>
  );

  return (
    <div className="flex justify-center items-center h-full bg-amber-300 dark:bg-amber-600">
      <Card className="w-[350px] bg-amber-300 border-none dark:bg-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-black dark:text-amber-300">Create Task</CardTitle>
          <CardDescription className="text-sm text-black dark:text-amber-200">
            Step {currentStep}: {currentStep === 1 ? "Client Information" : currentStep === 2 ? "Task Details" : "Schedule"}
          </CardDescription>
          <ProgressBar />
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col">
                <Label htmlFor="name">Client Name</Label>
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
                  placeholder="Description of the task or order" 
                  rows={4} 
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col">
                <Label htmlFor="type">Type of Task</Label>
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
                    <SelectValue placeholder="Select Team Member" />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-200 dark:bg-amber-600 border-none">
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
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prevData) => ({ ...prevData, priority: value }))}
                >
                  <SelectTrigger className="bg-amber-200 dark:bg-amber-600 border-none">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-200 dark:bg-amber-600 border-none">
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
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="startTime">Start Time <span className="text-xs">(Optional)</span></Label>
                  <Input
                    className="bg-amber-200 dark:bg-amber-600 border-none"
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="endTime">End Time <span className="text-xs">(Optional)</span></Label>
                  <Input
                    className="bg-amber-200 dark:bg-amber-600 border-none"
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-amber-200 dark:bg-amber-700 p-3 rounded-lg space-y-2">
                  <h3 className="font-medium text-black dark:text-amber-300">Task Summary</h3>
                  <p className="text-sm text-black dark:text-amber-200">
                    <strong>Client:</strong> {formData.name}<br />
                    <strong>Type:</strong> {formData.type}<br />
                    <strong>Priority:</strong> {formData.priority === "none" ? "No Priority" : `${formData.priority} Priority`}<br />
                    <strong>Date:</strong> {formData.date}
                    {formData.startTime && <><br /><strong>Time:</strong> {formData.startTime} - {formData.endTime || "N/A"}</>}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              className="bg-amber-200 hover:bg-amber-400 border-none dark:bg-amber-700 dark:hover:bg-amber-600" 
              onClick={prevStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="bg-amber-200 hover:bg-amber-400 border-none dark:bg-amber-700 dark:hover:bg-amber-600" 
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button 
              className={`bg-amber-400 hover:bg-amber-500 text-black border-none dark:bg-amber-600 dark:text-amber-200 
                dark:hover:bg-amber-500 ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              className={`bg-amber-400 hover:bg-amber-500 text-black border-none dark:bg-amber-600 dark:text-amber-200 
                dark:hover:bg-amber-500 ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              Create Task <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};