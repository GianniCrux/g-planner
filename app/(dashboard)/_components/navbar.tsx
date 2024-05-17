"use client";

import { 
    UserButton, 
    useOrganization,
 } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
    const { organization } = useOrganization();

    return (
        <div className="flex items-center gap-x-4 p-5 relative">
            <div className="lg:flex-1">
                <SearchInput />
            </div>
            {organization && (
            <InviteButton />
            )}
            <UserButton />
        </div>
    );
};