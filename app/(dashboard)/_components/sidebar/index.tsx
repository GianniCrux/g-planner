"use client";

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
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
import { Rows3 } from "lucide-react";
import Link from "next/link";



export const Sidebar = () => {
    return (
        <div className=" left-0 w-[200px] h-full flex p-2 flex-col gap-y-4 text-black  pt-5">
            <DropdownMenu> 
                <DropdownMenuTrigger>
                    <Link href="/" className="flex items-center pl-4">
                <Rows3 className="h-4 w-4 mr-2" /> 
                    Organizations List
                    </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuArrow></DropdownMenuArrow>
                <DropdownMenuLabel> Select the organization </DropdownMenuLabel>  
                <DropdownMenuSeparator>
                </DropdownMenuSeparator>
                    <List /> 
                    <NewButton />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};