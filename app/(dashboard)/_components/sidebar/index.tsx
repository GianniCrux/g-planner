"use client";

import { List } from "./list";
import { NewButton } from "./new_button";

export const Sidebar = () => {
    return (
        <div className="fixed z-[1] left-0 bg-blue-950 w-[80px] h-full flex p-3 flex-col gap-y-4 text-white pl-5 pt-5">
            <List />
            <NewButton />
        </div>
    );
};