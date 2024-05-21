"use client";

import { CardCreator } from "@/components/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/clerk-react";
import { TaskList } from "./_components/task-list";

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

  return (
  <div className="h-[calc(100%-80px)] flex flex-col p-6">
    {!organization ? (
    <EmptyOrg />
    ) : (
    <TaskList 
      orgId={organization.id}
      query={searchParams}
    />
    )}
  </div>
  );
};

export default DashboardPage;