"use client";


interface TaskCardProps {
    id: string;
    title: string;
    createdAt: number;
    orgId: string;
    assignedTo?: boolean;
    type?: string;
}

export const TaskCard = ({
    id,
    title,
    createdAt,
    orgId,
    assignedTo,
    type,
}: TaskCardProps) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();


    return (
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md relative border border-yellow-300 min-w-[200px]"> {/* Sticky note styling */}
      <div className="font-bold text-lg mb-2">{title}</div> {/* Client Name */}
      <div className="text-sm text-gray-600">
        Created by on {formattedDate}
      </div>
      <div className="absolute top-2 right-2">
        {assignedTo ? (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Personal</span>
        ) : (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Team</span>
        )}
      </div>
      <div className="mt-2 text-sm">Type: {type}</div> {/* Order Type */}
    </div>
  );
};