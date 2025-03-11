"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/clerk-react";
import { toast } from "sonner";
import { OrganizationMembershipResource } from "@clerk/types";
import { Book, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useProject } from "@/app/(dashboard)/contexts/ProjectContext";

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
  const { selectedProject } = useProject();
  const customers = useQuery(api.customer.get, { orgId: organization?.id ?? "" });
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
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
      setFormData((prevData) => ({ ...prevData, name: "" }));
      setIsNewCustomer(true);
    } else {
      const customer = customers?.find((c) => c._id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData((prevData) => ({
          ...prevData,
          name: customer.name,
        }));
        setIsNewCustomer(false);
      }
    }
  };

  const nextStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("right");
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const prevStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("left");
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const handleSubmit = () => {
    if (!organization) {
      return;
    }

    const selectedMembership = memberships.find(
      (membership) => membership.publicUserData.userId === formData.assignedTo
    );

    const assignedToName = selectedMembership
      ? `${selectedMembership.publicUserData.firstName || ""} ${selectedMembership.publicUserData.lastName || ""}`
      : "";

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
      projectId: selectedProject,
    })
      .then(() => {
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

  const getContentClasses = () => {
    const baseClasses = "transition-all duration-300 ease-in-out";
    if (isAnimating) {
      return direction === "right"
        ? `${baseClasses} -translate-x-full opacity-0`
        : `${baseClasses} translate-x-full opacity-0`;
    } else {
      return `${baseClasses} translate-x-0 opacity-100`;
    }
  };

  const progressPercentage = ((currentStep - 1) / 2) * 100;

  const ProgressBar = () => (
    <div className="flex justify-between items-center mb-4 px-1 relative">
      <div className="h-1 bg-gray-200 dark:bg-gray-600 absolute w-full top-4 left-0 -z-10 rounded-full"></div>
      <div
        className="h-1 bg-amber-500 dark:bg-amber-400 absolute top-4 left-0 -z-10 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      />
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-all duration-300
              ${
                currentStep === step
                  ? "bg-amber-500 text-white transform scale-110"
                  : currentStep > step
                  ? "bg-amber-400 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
              }`}
          >
            {currentStep > step ? <Check size={16} /> : step}
          </div>
          <div className="text-xs text-center text-gray-800 dark:text-gray-300">
            {step === 1 ? "Client" : step === 2 ? "Details" : "Schedule"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-center h-full bg-white dark:bg-gray-900">
      <Card className="w-[350px] bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden rounded-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
            Create Task
          </CardTitle>
          <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
            Step {currentStep}:{" "}
            {currentStep === 1
              ? "Client Information"
              : currentStep === 2
              ? "Task Details"
              : "Schedule"}
          </CardDescription>
          <ProgressBar />
        </CardHeader>
        <div className="relative overflow-hidden">
          <div className={getContentClasses()}>
            <CardContent className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <Label htmlFor="name">Client Name</Label>
                    {isNewCustomer ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          className="p-1"
                          onClick={() => setIsNewCustomer(false)}
                        >
                          <Book className="h-5 w-5" />
                        </Button>
                        <Input
                          className="bg-gray-100 dark:bg-gray-700 border-none placeholder-gray-500"
                          id="name"
                          placeholder="Name of the client"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    ) : (
                      <Select
                        value={selectedCustomer?._id ?? (isNewCustomer ? "new" : "")}
                        onValueChange={handleCustomerSelect}
                      >
                        <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-none">
                          <SelectValue placeholder="Select Customer or type new name" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-100 dark:bg-gray-700 border-none">
                          <SelectItem
                            value="new"
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            Type new name
                          </SelectItem>
                          {customers?.map((customer) => (
                            <SelectItem
                              key={customer._id}
                              value={customer._id}
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
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
                      className="bg-gray-100 dark:bg-gray-700 border-none placeholder-gray-500"
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
                      className="bg-gray-100 dark:bg-gray-700 border-none placeholder-gray-500"
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
                      onValueChange={(value) =>
                        setFormData((prevData) => ({ ...prevData, assignedTo: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-none">
                        <SelectValue placeholder="Select Team Member" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 dark:bg-gray-700 border-none">
                        {memberships &&
                          memberships.map((membership) => (
                            <SelectItem
                              key={membership.id}
                              value={membership.publicUserData.userId ?? ""}
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              {membership.publicUserData.firstName}{" "}
                              {membership.publicUserData.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prevData) => ({ ...prevData, priority: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-none">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 dark:bg-gray-700 border-none">
                        <SelectItem
                          value="high"
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          High Priority
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          Medium Priority
                        </SelectItem>
                        <SelectItem
                          value="low"
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          Low Priority
                        </SelectItem>
                        <SelectItem
                          value="none"
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
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
                      className="bg-gray-100 dark:bg-gray-700 border-none"
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <Label htmlFor="startTime">
                        Start Time <span className="text-xs">(Optional)</span>
                      </Label>
                      <Input
                        className="bg-gray-100 dark:bg-gray-700 border-none"
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="endTime">
                        End Time <span className="text-xs">(Optional)</span>
                      </Label>
                      <Input
                        className="bg-gray-100 dark:bg-gray-700 border-none"
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4 transform transition-all duration-500 translate-y-0 opacity-100">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg space-y-2">
                      <h3 className="font-medium text-gray-800 dark:text-gray-100">
                        Task Summary
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Client:</strong> {formData.name}
                        <br />
                        <strong>Type:</strong> {formData.type}
                        <br />
                        <strong>Priority:</strong>{" "}
                        {formData.priority === "none"
                          ? "No Priority"
                          : `${formData.priority} Priority`}
                        <br />
                        <strong>Date:</strong> {formData.date}
                        {formData.startTime && (
                          <>
                            <br />
                            <strong>Time:</strong> {formData.startTime} -{" "}
                            {formData.endTime || "N/A"}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </div>
        <CardFooter className="flex justify-between pt-2">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 border-none dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300"
              onClick={prevStep}
              disabled={isAnimating}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          ) : (
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 border-none dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              className={`bg-amber-500 hover:bg-amber-600 text-white border-none dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 ${
                !isStepValid() || isAnimating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={nextStep}
              disabled={!isStepValid() || isAnimating}
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className={`bg-amber-500 hover:bg-amber-600 text-white border-none dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 ${
                !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
