import Image from "next/image";

export const EmptyPersonal = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <Image src="/empty-personal.svg" height={140} width={140} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6 text-gray-800 dark:text-gray-100">
        No personal tasks.
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Try adding a task as personal.
      </p>
    </div>
  );
};
