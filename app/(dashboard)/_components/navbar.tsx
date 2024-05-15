import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
    return (
        <div className="flex items-center gap-x-4 p-5 relative">
            <div className="lg:flex lg:flex-1">
                <SearchInput />
            </div>
            <InviteButton />
            <UserButton />
        </div>
    );
};