"use client";

import { List } from "./list";
import { NewButton } from "./new_button";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"


import  Image  from "next/image";

export const Sidebar = () => {
    return (
        <div className="fixed left-0 w-[280px] h-full flex p-3 flex-col gap-y-4 text-black pl-5 pt-5">
            <DropdownMenu> 
                <DropdownMenuTrigger>
                    Organizations List
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuLabel>  <List /> </DropdownMenuLabel>  
                    <NewButton />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};