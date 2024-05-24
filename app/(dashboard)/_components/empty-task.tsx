"use client";

import { CardCreator } from "@/components/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";


import { useOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";


interface EmptyTaskProps {
  title: string;
  description: string;

}

export const EmptyTask = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.task.create); //creating the mutation to create the task

/*   const onClick = () => {
    console.log("Onclick")
    if (!organization) return; //breaking the function if there's no organization

    mutate({
      orgId: organization.id,
      title: "Untitled",
      description: "",     
    })
      .then((id) => {
        toast.success("Task created");
        // TODO: redirect to task/{id}
      })
      .catch(() => toast.error("Failed to create the task"))
  } */
  const [showDialog, setShowDialog] = useState(false);

  const toggleDialog = () => {
      setShowDialog((prevState) => !prevState);
  };

    return (
      <>
      {!showDialog && (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
        src="/note.svg"
        height={110}
        width={110}
        alt="Empty"
      />
      <h2 className="text-2xl font-semibold mt-6">
        Create your first task!
      </h2>
      <p className="text-mutedforeground text-sm mt-2">
        Start by creating a task for your company.
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={toggleDialog} size="lg">
          Create task
        </Button>
        </div>
        </div>
      )}
        {showDialog && (
                        <Dialog open={showDialog}> {/* TODO: onClose function on Dialog */} 
                            <DialogContent>
                                <CardCreator onClose={toggleDialog}/>
                            </DialogContent>
                        </Dialog>
                    )}

        </>
    );
};