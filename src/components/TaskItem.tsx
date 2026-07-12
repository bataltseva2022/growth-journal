import { useState } from "react";
import type { Task } from "../types/task";

type Props = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleExpand: (id: number) => void;
  onToggleSubtask: (taskId: number, subId: number) => void;
  onDeleteSubtask: (taskId: number, subId: number) => void;
  onAddSubtask: (taskId: number, text: string) => void;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onToggleExpand,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
}: Props) {
  const [input, setInput] = useState("");

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-3">

      {/* TASK HEADER */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
          />

          <span className={task.done ? "line-through text-gray-400" : ""}>
            {task.text}
          </span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onDelete(task.id)}>🗑</button>
          <button onClick={() => onToggleExpand(task.id)}>
            {task.expanded ? "▲" : "▼"}
          </button>
        </div>

      </div>

      {/* SUBTASKS */}
      {task.expanded && (
        <div className="mt-3 pl-6 border-l space-y-2">

          {task.subtasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={sub.done}
                onChange={() => onToggleSubtask(task.id, sub.id)}
              />

              <span className={sub.done ? "line-through text-gray-400" : ""}>
                {sub.text}
              </span>

              <button
                className="ml-auto text-red-500"
                onClick={() => onDeleteSubtask(task.id, sub.id)}
              >
                🗑
              </button>

            </div>
          ))}

          {/* ADD SUBTASK */}
          <div className="flex gap-2 mt-2">

            <input
              className="flex-1 p-1 border rounded"
              placeholder="Подзадача..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="px-2 bg-gray-200 rounded"
              onClick={() => {
                onAddSubtask(task.id, input);
                setInput("");
              }}
            >
              +
            </button>

          </div>

        </div>
      )}
    </div>
  );
}