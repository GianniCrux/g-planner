"use client";

import { Search } from "lucide-react";
import qs from "query-string";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
    //use router from the next/router doesnt work in the app folder but only in the pages folder
    const router = useRouter();
    const [value, setValue] = useState("");
    const [deboucedValue , setDebounced] = useDebounceValue(value, 500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: "/",
            query: {
                search: deboucedValue,
            },
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [deboucedValue, router]);    

    return (
        <div className="w-full relative">
            <Search
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            />
            <Input 
                className="w-full max-w-[516px] pl-9"
                placeholder="Search tasks"
                onChange={handleChange}
                value={value}
            />
        </div>
    )
}