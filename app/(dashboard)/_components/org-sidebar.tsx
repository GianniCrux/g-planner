"use client";

import { NewButton } from "./sidebar/new_button";

export const OrgSidebar = () => {
    return (
        <div className="fixed z-[1] left-0 bg-blue-950 w-[120px] h-full flex p-3 flex-col gap-y-4 text-white">
            <NewButton />
        </div>
    );
};