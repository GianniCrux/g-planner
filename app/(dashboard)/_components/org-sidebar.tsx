"use client";

import Link from "next/link";
import Image from "next/image";


import { UserIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";


import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { CalendarTask } from "./calendar-task";
import React from "react";


const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export interface OrgSidebarProps {
    children?: React.ReactNode;
}


export const OrgSidebar = ({children}: OrgSidebarProps) => {
    const searchParams = useSearchParams(); 
    const personal = searchParams.get("personal");

    return (
        <div className="flex-col w-[206px] pl-4 pt-2">
            {/* <Link href="/">
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
            </Link> */}
            {children}
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
                    <Link href="/">
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
                        <UserIcon  className="h-4 w-4 mr-2" />
                        Personal tasks
                    </Link>
                </Button>
            </div>
        </div>

    );
};