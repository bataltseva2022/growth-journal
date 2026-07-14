import {
  useState,
  type KeyboardEvent,
} from "react";

import type { Task } from "../types/task";

type Props = {
  task: Task;

  onToggle: (id: number) => void;

  onEditTask: (
    id: number,
    text: string
  ) => void;

  onDelete: (id: number) => void;

  onToggleExpand: (id: number) => void;

  onToggleSubtask: (
    taskId: number,
    subId: number
  ) => void;

  onDeleteSubtask: (
    taskId: number,
    subId: number
  ) => void;

  onAddSubtask: (
    taskId: number,
    text: string
  ) => void;
};

export default function TaskItem({
  task,
  onToggle,
  onEditTask,
  onDelete,
  onToggleExpand,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
}: Props) {
  const [
    subtaskInput,
    setSubtaskInput,
  ] = useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [editText, setEditText] =
    useState(task.text);

  function startEditing() {
    setEditText(task.text);
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditText(task.text);
    setIsEditing(false);
  }

  function saveEditing() {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      return;
    }

    onEditTask(task.id, trimmedText);
    setEditText(trimmedText);
    setIsEditing(false);
  }

  function handleEditKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditing();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  }

  function addNewSubtask() {
    const trimmedText =
      subtaskInput.trim();

    if (!trimmedText) {
      return;
    }

    onAddSubtask(
      task.id,
      trimmedText
    );

    setSubtaskInput("");
  }

  function handleSubtaskKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewSubtask();
    }
  }

  const saveIsDisabled =
    editText.trim().length === 0;

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/70
        bg-white/85
        p-4
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-1
            items-start
            gap-3
          "
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={() =>
              onToggle(task.id)
            }
            className="
              mt-1
              h-4
              w-4
              shrink-0
              cursor-pointer
              accent-pink-500
            "
            aria-label={
              task.done
                ? "Отметить задачу как невыполненную"
                : "Отметить задачу как выполненную"
            }
          />

          {isEditing ? (
            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
                gap-2
                sm:flex-row
              "
            >
              <input
                type="text"
                value={editText}
                onChange={(event) =>
                  setEditText(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleEditKeyDown
                }
                autoFocus
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-pink-200
                  bg-white
                  px-3
                  py-2
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-pink-300
                  focus:ring-2
                  focus:ring-pink-100
                "
                aria-label="Редактирование задачи"
              />

              <div
                className="
                  flex
                  shrink-0
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={saveEditing}
                  disabled={saveIsDisabled}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                    transition
                    hover:bg-green-100
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Сохранить изменения"
                  title="Сохранить"
                >
                  ✓
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-500
                    transition
                    hover:bg-gray-200
                  "
                  aria-label="Отменить редактирование"
                  title="Отменить"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <span
              className={`
                min-w-0
                flex-1
                break-words
                text-sm
                leading-6
                ${
                  task.done
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }
              `}
            >
              {task.text}
            </span>
          )}
        </div>

        {!isEditing && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
            "
          >
            <button
              type="button"
              onClick={startEditing}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-sm
                transition
                hover:bg-pink-50
              "
              aria-label="Редактировать задачу"
              title="Редактировать задачу"
            >
              ✏️
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(task.id)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-sm
                transition
                hover:bg-red-50
              "
              aria-label="Удалить задачу"
              title="Удалить задачу"
            >
              🗑
            </button>

            <button
              type="button"
              onClick={() =>
                onToggleExpand(task.id)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-sm
                text-gray-500
                transition
                hover:bg-gray-100
              "
              aria-label={
                task.expanded
                  ? "Скрыть подзадачи"
                  : "Показать подзадачи"
              }
              title={
                task.expanded
                  ? "Скрыть подзадачи"
                  : "Показать подзадачи"
              }
            >
              {task.expanded
                ? "▲"
                : "▼"}
            </button>
          </div>
        )}
      </div>

      {task.expanded && (
        <div
          className="
            mt-4
            space-y-3
            border-l-2
            border-pink-100
            pl-5
          "
        >
          {task.subtasks.length ===
            0 && (
            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Подзадач пока нет
            </p>
          )}

          {task.subtasks.map(
            (subtask) => (
              <div
                key={subtask.id}
                className="
                  flex
                  items-start
                  gap-2
                  rounded-xl
                  bg-white/70
                  px-3
                  py-2
                "
              >
                <input
                  type="checkbox"
                  checked={subtask.done}
                  onChange={() =>
                    onToggleSubtask(
                      task.id,
                      subtask.id
                    )
                  }
                  className="
                    mt-1
                    h-4
                    w-4
                    shrink-0
                    cursor-pointer
                    accent-pink-500
                  "
                />

                <span
                  className={`
                    min-w-0
                    flex-1
                    break-words
                    text-sm
                    ${
                      subtask.done
                        ? "text-gray-400 line-through"
                        : "text-gray-600"
                    }
                  `}
                >
                  {subtask.text}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteSubtask(
                      task.id,
                      subtask.id
                    )
                  }
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-xs
                    transition
                    hover:bg-red-50
                  "
                  aria-label="Удалить подзадачу"
                  title="Удалить подзадачу"
                >
                  🗑
                </button>
              </div>
            )
          )}

          <div
            className="
              flex
              gap-2
              pt-1
            "
          >
            <input
              type="text"
              value={subtaskInput}
              onChange={(event) =>
                setSubtaskInput(
                  event.target.value
                )
              }
              onKeyDown={
                handleSubtaskKeyDown
              }
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-pink-100
                bg-white/80
                px-3
                py-2
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-pink-300
                focus:ring-2
                focus:ring-pink-100
              "
              placeholder="Новая подзадача..."
            />

            <button
              type="button"
              onClick={addNewSubtask}
              disabled={
                subtaskInput.trim()
                  .length === 0
              }
              className="
                rounded-xl
                bg-pink-50
                px-4
                font-semibold
                text-pink-600
                transition
                hover:bg-pink-100
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Добавить подзадачу"
              title="Добавить подзадачу"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}