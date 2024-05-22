"use client";

import Link from "next/link";
import Image from "next/image";

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";

import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"
import { Rows3, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";


import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { List } from "./sidebar/list";
import { NewButton } from "./sidebar/new_button";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});


export const OrgSidebar = () => {
    const searchParams = useSearchParams(); 
    const personal = searchParams.get("personal");

    return (
        <div className="flex-col w-[206px] pl-4 pt-2">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image 
                        src="/plannerLogo.svg"
                        alt="Logo"
                        height={60}
                        width={60}
                    />
                    <span className={cn(
                        "font-semibold text-2xl",
                        font.className,
                    )}>
                        GPlanner
                    </span>
                </div>
            </Link>
            <OrganizationSwitcher
                hidePersonal
                appearance={{
                    elements: {
                        rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        },
                        organizationSwitcherTrigger: {
                            padding: "6px",
                            width: "100%",
                            borderRadius: "1px solid #FFD54F",
                            justifyContent: "space-between",
                            backgroundColor: "#FFD54F",
                            color: "black",
                        },
                        organizationSwitcherDropdown: {
                            backgroundColor: "black",
                        },
                        organizationSwitcherItem: {
                            backgroundColor: "black"
                        }
                    }
                }}
            />
            <div className="space-y-1 w-full bg-amber-300">
                <Button
                    variant={personal ? "ghost" : "secondary"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href="/" className="bg-amber-300">
                        <LayoutDashboard  className="h-4 w-4 mr-2" />
                        Team tasks
                    </Link>
                </Button>
                <Button
                    variant={personal ? "secondary" : "ghost"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href={{
                        pathname: "/",
                        query: { personal: true }
                    }}>
                        <Star  className="h-4 w-4 mr-2" />
                        Personal tasks
                    </Link>
                </Button>
                <div>
            <DropdownMenu> 
                <DropdownMenuTrigger>
                    <Button 
                    variant="ghost"
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                    >
                    <Link href="/" className="flex items-center">
                <Rows3 className="h-4 w-4 mr-2" /> 
                  Organizations List 
                    </Link>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-amber-300">
                <DropdownMenuArrow></DropdownMenuArrow>
                <DropdownMenuLabel> Select the organization </DropdownMenuLabel>  
                <DropdownMenuSeparator />
                    <List /> 
                    <NewButton />

                </DropdownMenuContent>
            </DropdownMenu>
                </div>
            </div>
        </div>

    );
};