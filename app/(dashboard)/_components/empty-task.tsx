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

export const EmptyTask = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.task.create);
  const [showDialog, setShowDialog] = useState(false);

  const toggleDialog = () => {
    setShowDialog((prevState) => !prevState);
  };

  return (
    <>
      {!showDialog && (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <Image src="/note.svg" height={110} width={110} alt="Empty" />
          <h2 className="text-2xl font-semibold mt-6 text-gray-800 dark:text-gray-100">
            Create your first task!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
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
        <Dialog open={showDialog}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-lg p-4 rounded-md">
            <CardCreator onClose={toggleDialog} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
