import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <Image src="/empty-search2.svg" height={140} width={140} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6 text-gray-800 dark:text-gray-100">
        No results found!
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Try searching for something else.
      </p>
    </div>
  );
};
