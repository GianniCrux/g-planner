"use client";


interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    orgId: string;
    assignedTo?: string;
    type?: string;
    authorName: string;
}

export const TaskCard = ({
    id,
    title,
    description,
    createdAt,
    orgId,
    assignedTo,
    type,
    authorName,
}: TaskCardProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();


    return (
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md relative border border-yellow-300 min-w-[200px]"> {/* Sticky note styling */}
      <div className="font-bold text-lg mb-2">{title}</div> {/* Client Name */}
      <div className="text-sm text-gray-600">
        Created by {authorName} on {formattedDate}
        <div className="text-md text-black"> {description} </div>
      </div>
      <div className="absolute top-2 right-2">
        <span className="bg-amber-800 text-white text-xs px-2 py-1 rounded">Per: {assignedTo}</span>
      </div>
      <div className="mt-2 text-sm">Type: {type}</div> {/* Order Type */}

    </div>
  );
};