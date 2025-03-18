"use client";

import { useState } from "react";
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
        <div className="flex items-center gap-x-2 relative">
          <Image src="/plannerLogo.svg" alt="GPlanner" height={60} width={60} />
          <div className="relative flex items-center">
            <span
              className={cn(
                "font-semibold text-2xl hidden sm:block text-gray-800 dark:text-gray-100",
                font.className
              )}
            >
              GPlanner
            </span>
            <span className="absolute sm:-right-0 sm:top-2/3 sm:translate-y-1/2 right-0 top-0 translate-x-1/2 translate-y-1/2 text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded uppercase font-bold shadow">
              Beta
            </span>
          </div>
        </div>
      </Link>

      <div className="lg:flex-1">
        <SearchInput />
      </div>

      {organization && (
        <div className="flex items-center gap-x-4">
          <InviteButton />
        </div>
      )}

      <AddressBook />
      <DarkModeToggle />
      <UserButton />
    </div>
  );
};
