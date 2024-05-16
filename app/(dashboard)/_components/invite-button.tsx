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
            <DialogContent  className="bg-transparent border-none max-w-[480px]">
                <div className="max-w-md mx-auto ">
                <OrganizationProfile 
                routing="hash"/>
                </div>
            </DialogContent>
        </Dialog>
    );
};