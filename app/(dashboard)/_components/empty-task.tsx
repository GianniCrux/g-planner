import { Button } from "@/components/ui/button";
import Image from "next/image";

export const EmptyTask = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
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
          Create task
        </Button>
        </div>
        </div>
    );
};