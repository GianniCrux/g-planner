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
                <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite members
                </Button>
            </DialogTrigger>
            <DialogContent  className="bg-transparent border-none rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="max-h-[550px] overflow-auto">
          <OrganizationProfile routing="hash" />
        </div>
            </DialogContent>
        </Dialog>
    );
};