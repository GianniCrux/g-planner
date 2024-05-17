"use client";

import { CardCreator } from "@/components/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/clerk-react";



const DashboardPage = () => {
  const { organization } = useOrganization();

  return (
  <div className="h-[calc(100%-80px)] flex flex-col items-center justify-center p-6">
    {!organization ? (
    <EmptyOrg />
    ) : ( 
    <div>
      <Image
        src="/note.svg"
        height={110}
        width={110}
        alt="Empty"
      />
      <h2 className="text-2xl font-semibold mt-6">
        Create your first task!
      </h2>
      <p className="text-mutedforeground text-sm mt-2">
        Start by creating a task for your company.
      </p>
      <div className="mt-6">
        <Button size="lg">
          Create task.
        </Button>
      </div>
      {/* <CardCreator /> */}
    </div>
    )}
  </div>
  );
};

export default DashboardPage;