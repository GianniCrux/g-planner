"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CardCreator } from "@/components/card";
import { EmptySearch } from "./empty-search";
import { EmptyPersonal } from "./empty-personal";
import { EmptyTask } from "./empty-task";

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
    const data = [];

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
        <div>
      <CardCreator /> 
    </div>
    )
}