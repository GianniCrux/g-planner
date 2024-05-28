"use client";

import { CardCreator } from "@/components/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/clerk-react";
import { TaskList } from "./_components/task-list";
import { useState } from "react";
import { CalendarTask } from "./_components/calendar-task";
import { Calendar, NotebookTextIcon } from "lucide-react";

interface DashboardPageProps {
  searchParams: {
    search?: string; 
    personal?: string;
  }
}


const DashboardPage = ({
  searchParams,
}: DashboardPageProps) => {
  const { organization } = useOrganization();
  const [isCalendarView, setIsCalendarView] = useState(false);

  const handleViewChange = () => {
    setIsCalendarView((prevState) => !prevState);
  }

  return (
  <div className="h-[calc(100%-80px)] flex flex-col p-6">
    {!organization ? (
    <EmptyOrg />
    ) : (
      <>
    <div className="flex justify-center mb-4">
      <Button
        onClick={handleViewChange}
        disabled={!isCalendarView}
        className="px-4 py-2 rounded-l-md bg-amber-700 hover:bg-amber-900"
      >
      <NotebookTextIcon className="h-4 w-4 mr-2"/>
        Task list
      </Button>
      <Button 
        onClick={handleViewChange}
        disabled={isCalendarView}
        className="px-4 py-2 rounded-r-md bg-amber-700 hover:bg-amber-900"
      >
      <Calendar className="h-4 w-4 mr-2" />
          Calendar
      </Button>
    </div>
    {isCalendarView ? <CalendarTask /> : <TaskList orgId={organization.id} query={searchParams} />}
    </>
    )}
  </div>
  );
};

export default DashboardPage;