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
import { useState } from "react";

import { 
    Dialog, 
    DialogContent,
} from "@/components/ui/dialog";
import { Loading } from "@/components/auth/loading";

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

    const [showDialog, setShowDialog] = useState(false);

    const toggleDialog = () => {
        setShowDialog((prevState) => !prevState);
    };

    if (data === undefined) { //data can never be undefined regardless there's an error or it's empty
        return (
            <div>
                <Loading />
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
            <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <div className="flex justify-end mb-4">
                    <Button 
                    onClick={toggleDialog}
                    className="h-full w-full bg-yellow-200 text-black hover:bg-amber-500"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                    { showDialog && (
                        <Dialog open={showDialog}> {/* TODO: onClose function on Dialog */} 
                            <DialogContent className="bg-amber-200" >
                                <CardCreator onClose={toggleDialog}/>
                            </DialogContent>
                        </Dialog>
                    ) }
                </div>
                {data?.map((task) => (
                    <TaskCard 
                        key={task._id}
                        id={task._id}
                        title={task.title}
                        description={task.description}
                        assignedTo={task.assignedTo}
                        createdAt={task._creationTime}
                        orgId={task.orgId}
                        authorName={task.authorName}
                        date={task.date}
                        type={task.type}
                    />
                ))}

            </div>
            </div>

    )
}