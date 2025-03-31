import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <li className={`flex items-center justify-between p-4 border-b border-gray-300 ${
      task.completed ? "bg-gray-50" : ""
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`p-1 rounded-full ${
            task.completed
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <FaCheck size={14} />
        </button>
        <span className={`text-lg ${
          task.completed ? "text-gray-500 line-through" : "text-gray-800"
        }`}>
          {task.name}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-500 hover:text-blue-600 p-2"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-600 p-2"
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
} 