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
                <Button variant="outline" className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite members
                </Button>
            </DialogTrigger>
            <DialogContent  className="bg-transparent border-none rounded-lg shadow-lg p-6 max-w-[950px] max-h-sm">
        <div className="max-h-[500px] max-w-[950px] overflow-auto scrollbar-hide">
          <OrganizationProfile routing="hash"/>
            </div>
            </DialogContent>
        </Dialog>
    );
};