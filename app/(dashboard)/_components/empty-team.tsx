import Image from "next/image";

export const EmptyTeamTasks = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image 
                src="/empty-team.svg"
                height={140}
                width={140}
                alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                No team tasks!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Complete your personal tasks or add another team task.
            </p>
        </div>
    );
};