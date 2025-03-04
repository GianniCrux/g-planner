"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarIcon, XIcon, ArrowLeftIcon } from "lucide-react";
import { OrgSidebar } from "./org-sidebar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { InviteButton } from "./invite-button";
import { useOrganization } from "@clerk/nextjs";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const ClientOrgSidebar = () => {
  const { organization } = useOrganization();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    if (!isSidebarCollapsed) {
      const timeoutId = setTimeout(() => setIsContentVisible(true), 150);
      return () => clearTimeout(timeoutId);
    } else {
      setIsContentVisible(false);
    }
  }, [isSidebarCollapsed]);

  return (
    <div className="relative h-full">
      {/* Mobile view */}
      <div className="sm:hidden p-2">
        <Button variant="outline" onClick={toggleSidebar}>
          <SidebarIcon className="h-5 w-5" />
        </Button>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
            <div
              ref={sidebarRef}
              className="h-full w-64 max-w-[80vw] bg-white dark:bg-gray-800"
            >
              <div className="flex justify-end p-4">
                <Button variant="outline" onClick={closeSidebar}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <OrgSidebar>
                <div>
                  <Link href="/">
                    <div className="flex items-center gap-x-2">
                      <Image src="/plannerLogo.svg" alt="Logo" height={60} width={60} />
                      <span className={cn("text-2xl", font.className)}>GPlanner</span>
                    </div>
                  </Link>
                </div>
              </OrgSidebar>
              <div className="pl-4">
                {organization && <InviteButton />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Larger screens */}
      <div className="hidden sm:flex shadow-lg h-full pl-2">
        <div
          className={cn(
            "relative bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
            {
              "w-64": !isSidebarCollapsed,
              "w-0": isSidebarCollapsed,
            }
          )}
        >
          {!isSidebarCollapsed && (
            <div
              className={cn("transition-opacity duration-300 pl-2", {
                "opacity-0": !isContentVisible,
                "opacity-100": isContentVisible,
              })}
            >
              <OrgSidebar />
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "absolute top-2 -right-5 p-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-full shadow",
              "transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ArrowLeftIcon
              className={cn("h-4 w-4 text-gray-600 dark:text-gray-300", {
                "rotate-180": !isSidebarCollapsed,
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
