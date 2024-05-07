"use client";

import { List } from "./list";
import { NewButton } from "./new_button";


import  Image  from "next/image";

export const Sidebar = () => {
    return (
        <div className="fixed left-0 bg-blue-950 w-[280px] h-full flex p-3 flex-col gap-y-4 text-white pl-5 pt-5">
            <List />
            <NewButton />
        </div>
    );
};