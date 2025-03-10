"use client";

import { UserButton, useOrganization } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import DarkModeToggle from "./dark-mode-toggle";
import AddressBook from "./address-book";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5 relative bg-white dark:bg-gray-900 shadow-md">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/plannerLogo.svg" alt="GPlanner" height={60} width={60} />
          <span
            className={cn(
              "font-semibold text-2xl hidden sm:block text-gray-800 dark:text-gray-100",
              font.className
            )}
          >
            GPlanner
          </span>
        </div>
      </Link>
      <div className="lg:flex-1">
        <SearchInput />
      </div>
      {organization && (
        <div className="hidden sm:block">
          <InviteButton />
        </div>
      )}
      <AddressBook />
      <DarkModeToggle />
      <UserButton />
    </div>
  );
};
