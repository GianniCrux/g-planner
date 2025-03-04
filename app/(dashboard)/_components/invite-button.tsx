import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 max-w-[950px] max-h-sm"
      >
        <div className="max-h-[500px] max-w-[950px] overflow-auto scrollbar-hide">
          <OrganizationProfile routing="hash" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
