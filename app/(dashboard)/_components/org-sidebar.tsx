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

export const OrgSidebar = ({ children }: OrgSidebarProps) => {
    const searchParams = useSearchParams();
    const personal = searchParams.get("personal");

    return (
        <div className="flex-col w-[206px] pt-2 bg-white dark:bg-gray-800">
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
                            borderRadius: "1px solidrgb(255, 255, 255)",
                            justifyContent: "space-between",
                            backgroundColor: "#B0BEC5",
                            color: "black",
                            '&:hover': {
                                backgroundColor: "#90A4AE",
                                color: "black",
                            },
                        },
                        organizationSwitcherDropdown: {
                            backgroundColor: "black",
                        },
                        organizationSwitcherItem: {
                            backgroundColor: "black",
                        },
                    },
                }}
            />
            <div className="space-y-1 w-full bg-white dark:bg-gray-800">
                <Button
                    variant={personal ? "ghost" : "secondary"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full dark:text-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-whit shadow-xl hover:shadow-2xl"
                >
                    <Link href="/">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Team tasks
                    </Link>
                </Button>
                <Button
                    variant={personal ? "secondary" : "ghost"}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full dark:text-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-white shadow-xl hover:shadow-2xl"
                >
                    <Link
                        href={{
                            pathname: "/",
                            query: { personal: true },
                        }}
                    >
                        <UserIcon className="h-4 w-4 mr-2" />
                        Personal tasks
                    </Link>
                </Button>
            </div>
        </div>
    );
};
