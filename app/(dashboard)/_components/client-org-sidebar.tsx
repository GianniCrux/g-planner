"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarIcon, XIcon, ArrowRightIcon } from "lucide-react";
import { OrgSidebar } from "./org-sidebar"; // Import OrgSidebarProps
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
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
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
    <div className="relative">
      {/* Mobile view */}
      <div className="sm:hidden">
        <Button
          className="bg-amber-500 hover:bg-amber-700"
          onClick={toggleSidebar}
        >
          <SidebarIcon className="text-black" />
        </Button>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-amber-600 bg-opacity-50 flex">
            <div
              ref={sidebarRef}
              className="h-full bg-amber-300 w-64 max-w-[80vw]"
            >
              <div className="flex justify-end p-4">
                <Button
                  onClick={closeSidebar}
                  className="bg-amber-300 hover:bg-amber-300"
                >
                  <XIcon className="text-black" />
                </Button>
              </div>
              <OrgSidebar>
                <div className="px-4 pb-4">
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
                </div>
              </OrgSidebar>
              <div className="pl-4">
              {organization && (
              <InviteButton />
              )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Medium and larger screens */}
      <div className="hidden sm:block">
        <Button
          className={`bg-amber-300 hover:bg-amber-300 transition-transform duration-300 ${
            isSidebarCollapsed ? "rotate-180" : ""
          }`}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ArrowRightIcon className="text-black" />
        </Button>
        <div className={cn(
          "overflow-hidden duration-300 ease-in-out",
          {
            "w-64": !isSidebarCollapsed,
            "w-0": isSidebarCollapsed,
          }
        )}
      >
        {!isSidebarCollapsed && (
                  <div 
                  className={cn(
                    "transition-opacity duration-300",
                    { "opacity-0": !isContentVisible, "opacity-100": isContentVisible }
                  )}
                > 
          <OrgSidebar />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};