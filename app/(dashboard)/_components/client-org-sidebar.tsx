"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarIcon, XIcon } from "lucide-react";
import { OrgSidebar } from "./org-sidebar";

export const ClientOrgSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = ( ) => {
    setIsSidebarOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if(
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

  return (
    <>
      <div className="sm:block hidden">
        <OrgSidebar />
      </div>
      <div className="sm:hidden pt-5">
        <Button 
            className="bg-amber-600 hover:bg-amber-800"
            onClick={toggleSidebar}
        >
          <SidebarIcon className="text-black"/>
        </Button>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-amber-600 bg-opacity-50">
            <div 
                ref={sidebarRef}
                className="absolute top-0 left-0 h-full bg-amber-300"
            >
                <div className="flex justify-end p-4">
                    <Button 
                        onClick={closeSidebar}
                        className="bg-amber-500 hover:bg-amber-800"
                    >
                        <XIcon className="text-black" />
                    </Button>
                </div>
              <OrgSidebar />
            </div>
          </div>
        )}
      </div>
    </>
  );
};