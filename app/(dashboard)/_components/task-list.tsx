"use client";



import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CardCreator } from "@/components/card";
import { EmptySearch } from "./empty-search";
import { EmptyPersonal } from "./empty-personal";
import { EmptyTask } from "./empty-task";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus } from "lucide-react";
import { TaskCard } from "./task-card";

interface TaskListProps {
    orgId: string;
    query: {
        search?: string;
        personal?: string;
    };
};

export const TaskList = ({
    orgId,
    query,
}: TaskListProps) => {
    const data = useQuery(api.tasks.get, { orgId });

    if (data === undefined) { //data can never be undefined regardless there's an error or it's empty
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (!data?.length && query.search) { //if we don't have data length but we have query.search it means that data is empty cause the user searched for something that doesn exists
        return (
            <EmptySearch />
        );
    };

    if (!data?.length && query.personal) {
        return (
            <EmptyPersonal />
        );
    } 

    if (!data?.length) {
        return (
            <EmptyTask />
        )
    }


    return (
        <div className="flex flex-col">
            <h2 className="text-3xl">
                {query.personal ? "Personal tasks" : "Team tasks"}
            </h2>
                            <CardCreator />
            <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                {data?.map((task) => (
                    <TaskCard 
                        key={task._id}
                        id={task._id}
                        title={task.title}
                        authorId={task.authorId}
                        authorName={task.authorName}
                        type={task.type}
                        assignedTo={true}
                        createdAt={task._creationTime}
                        orgId={task.orgId}
                        
                    />
                ))}

            </div>
            </div>

    )
}