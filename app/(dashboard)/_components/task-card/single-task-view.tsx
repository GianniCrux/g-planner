

interface SingleTaskViewProps {
    task: {
      _id: string;
      _creationTime: number; 
      title: string;
      description: string;
      orgId: string;
      assignedTo?: string;
      authorId: string;
      authorName: string;
      date?: string;
      type?: string;
    };
  }
  

export const SingleTaskView = ({ task }: SingleTaskViewProps) => {


    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <span className="text-gray-500">{task.date}</span>
      </div>
      <p className="text-gray-700 mb-4">{task.description}</p>
      <div className="flex items-center">
        <span className="text-gray-700">Assigned to: {task.assignedTo}</span>
      </div>
      <div className="mt-4">
        <span className="text-gray-500 mr-2">Created by:</span>
        <span className="text-gray-700">{task.authorName}</span>
      </div>
    </div>
    )
}