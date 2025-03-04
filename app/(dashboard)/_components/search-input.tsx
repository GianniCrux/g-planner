"use client";

import { Search } from "lucide-react";
import qs from "query-string";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [deboucedValue, setDebounced] = useDebounceValue(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: deboucedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [deboucedValue, router]);

  return (
    <div className="w-full relative">
      <Search
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4"
      />
      <Input
        className="w-full max-w-[580px] pl-9 lg:max-w-[750px] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-amber-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-amber-500"
        placeholder="Search tasks"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};
