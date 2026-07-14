import {
  useState,
  type KeyboardEvent,
} from "react";

import type {
  Task,
  TaskTimeField,
} from "../types/task";

type Props = {
  task: Task;

  onToggle: (
    id: number
  ) => void;

  onEditTask: (
    id: number,
    text: string
  ) => void;

  onUpdateTaskTime: (
    taskId: number,
    field: TaskTimeField,
    value: string | null
  ) => void;

  onClearTaskTime: (
    taskId: number
  ) => void;

  onDelete: (
    id: number
  ) => void;

  onToggleExpand: (
    id: number
  ) => void;

  onToggleSubtask: (
    taskId: number,
    subId: number
  ) => void;

  onEditSubtask: (
    taskId: number,
    subId: number,
    text: string
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

function getCurrentTime(): string {
  const now = new Date();

  const hours = String(
    now.getHours()
  ).padStart(2, "0");

  const minutes = String(
    now.getMinutes()
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function timeToMinutes(
  time: string
): number {
  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;
}

function calculateDuration(
  startedAt: string | null,
  finishedAt: string | null
): number | null {
  if (!startedAt || !finishedAt) {
    return null;
  }

  const startMinutes =
    timeToMinutes(startedAt);

  const finishMinutes =
    timeToMinutes(finishedAt);

  let difference =
    finishMinutes - startMinutes;

  if (difference < 0) {
    difference += 24 * 60;
  }

  return difference;
}

function formatDuration(
  minutes: number
): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
}

export default function TaskItem({
  task,
  onToggle,
  onEditTask,
  onUpdateTaskTime,
  onClearTaskTime,
  onDelete,
  onToggleExpand,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onAddSubtask,
}: Props) {
  const [
    subtaskInput,
    setSubtaskInput,
  ] = useState("");

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    editText,
    setEditText,
  ] = useState(task.text);

  const [
    editingSubtaskId,
    setEditingSubtaskId,
  ] = useState<number | null>(
    null
  );

  const [
    subtaskEditText,
    setSubtaskEditText,
  ] = useState("");

  const durationMinutes =
    calculateDuration(
      task.startedAt,
      task.finishedAt
    );

  function startEditing() {
    setEditText(task.text);
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditText(task.text);
    setIsEditing(false);
  }

  function saveEditing() {
    const trimmedText =
      editText.trim();

    if (!trimmedText) {
      return;
    }

    onEditTask(
      task.id,
      trimmedText
    );

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

  function startSubtaskEditing(
    subtaskId: number,
    text: string
  ) {
    setEditingSubtaskId(
      subtaskId
    );

    setSubtaskEditText(text);
  }

  function cancelSubtaskEditing() {
    setEditingSubtaskId(null);
    setSubtaskEditText("");
  }

  function saveSubtaskEditing() {
    if (
      editingSubtaskId === null
    ) {
      return;
    }

    const trimmedText =
      subtaskEditText.trim();

    if (!trimmedText) {
      return;
    }

    onEditSubtask(
      task.id,
      editingSubtaskId,
      trimmedText
    );

    setEditingSubtaskId(null);
    setSubtaskEditText("");
  }

  function handleSubtaskEditKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveSubtaskEditing();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelSubtaskEditing();
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

  const subtaskSaveIsDisabled =
    subtaskEditText.trim()
      .length === 0;

  const hasTimeData =
    task.startedAt !== null ||
    task.finishedAt !== null;

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
                  onClick={
                    saveEditing
                  }
                  disabled={
                    saveIsDisabled
                  }
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
                  onClick={
                    cancelEditing
                  }
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
            <div
              className="
                min-w-0
                flex-1
              "
            >
              <span
                className={`
                  block
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

              {hasTimeData && (
                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-1
                    text-xs
                    text-gray-400
                  "
                >
                  {task.startedAt && (
                    <span>
                      Начало:{" "}
                      {task.startedAt}
                    </span>
                  )}

                  {durationMinutes !==
                    null && (
                    <span>
                      Потрачено:{" "}
                      {formatDuration(
                        durationMinutes
                      )}
                    </span>
                  )}

                  {task.finishedAt && (
                    <span>
                      Завершение:{" "}
                      {task.finishedAt}
                    </span>
                  )}
                </div>
              )}
            </div>
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
                onToggleExpand(
                  task.id
                )
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
                  ? "Скрыть детали задачи"
                  : "Показать детали задачи"
              }
              title={
                task.expanded
                  ? "Скрыть детали"
                  : "Показать детали"
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
            space-y-4
            border-l-2
            border-pink-100
            pl-5
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-pink-100
              bg-pink-50/40
              p-4
            "
          >
            <div
              className="
                mb-3
                flex
                flex-wrap
                items-center
                justify-between
                gap-2
              "
            >
              <div>
                <h4
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  ⏱️ Время работы
                </h4>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-400
                  "
                >
                  Укажи время вручную
                  или нажми «Сейчас»
                </p>
              </div>

              {hasTimeData && (
                <button
                  type="button"
                  onClick={() =>
                    onClearTaskTime(
                      task.id
                    )
                  }
                  className="
                    rounded-lg
                    px-2
                    py-1
                    text-xs
                    text-gray-400
                    transition
                    hover:bg-white
                    hover:text-red-500
                  "
                >
                  Сбросить время
                </button>
              )}
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-3
                lg:grid-cols-3
              "
            >
              <div
                className="
                  rounded-xl
                  bg-white/80
                  p-3
                "
              >
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  Начала работать
                </label>

                <div
                  className="
                    flex
                    gap-2
                  "
                >
                  <input
                    type="time"
                    value={
                      task.startedAt ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      onUpdateTaskTime(
                        task.id,
                        "startedAt",
                        event.target
                          .value || null
                      )
                    }
                    className="
                      min-w-0
                      flex-1
                      rounded-lg
                      border
                      border-pink-100
                      bg-white
                      px-2
                      py-2
                      text-sm
                      text-gray-700
                      outline-none
                      focus:border-pink-300
                      focus:ring-2
                      focus:ring-pink-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateTaskTime(
                        task.id,
                        "startedAt",
                        getCurrentTime()
                      )
                    }
                    className="
                      rounded-lg
                      bg-pink-50
                      px-3
                      text-xs
                      font-medium
                      text-pink-600
                      transition
                      hover:bg-pink-100
                    "
                  >
                    Сейчас
                  </button>
                </div>
              </div>

              <div
                className="
                  rounded-xl
                  bg-white/80
                  p-3
                "
              >
                <span
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  Потратила времени
                </span>

                <div
                  className="
                    flex
                    min-h-10
                    items-center
                    rounded-lg
                    border
                    border-violet-100
                    bg-violet-50/50
                    px-3
                    text-sm
                    font-semibold
                    text-violet-600
                  "
                >
                  {durationMinutes !==
                  null
                    ? formatDuration(
                        durationMinutes
                      )
                    : task.startedAt
                      ? "В процессе"
                      : "—"}
                </div>
              </div>

              <div
                className="
                  rounded-xl
                  bg-white/80
                  p-3
                "
              >
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  Закончила работать
                </label>

                <div
                  className="
                    flex
                    gap-2
                  "
                >
                  <input
                    type="time"
                    value={
                      task.finishedAt ??
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      onUpdateTaskTime(
                        task.id,
                        "finishedAt",
                        event.target
                          .value || null
                      )
                    }
                    className="
                      min-w-0
                      flex-1
                      rounded-lg
                      border
                      border-pink-100
                      bg-white
                      px-2
                      py-2
                      text-sm
                      text-gray-700
                      outline-none
                      focus:border-pink-300
                      focus:ring-2
                      focus:ring-pink-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateTaskTime(
                        task.id,
                        "finishedAt",
                        getCurrentTime()
                      )
                    }
                    className="
                      rounded-lg
                      bg-pink-50
                      px-3
                      text-xs
                      font-medium
                      text-pink-600
                      transition
                      hover:bg-pink-100
                    "
                  >
                    Сейчас
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4
              className="
                mb-3
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Подзадачи
            </h4>

            <div className="space-y-3">
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
                (subtask) => {
                  const isSubtaskEditing =
                    editingSubtaskId ===
                    subtask.id;

                  return (
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
                        checked={
                          subtask.done
                        }
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

                      {isSubtaskEditing ? (
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
                            value={
                              subtaskEditText
                            }
                            onChange={(
                              event
                            ) =>
                              setSubtaskEditText(
                                event.target
                                  .value
                              )
                            }
                            onKeyDown={
                              handleSubtaskEditKeyDown
                            }
                            autoFocus
                            className="
                              min-w-0
                              flex-1
                              rounded-lg
                              border
                              border-pink-200
                              bg-white
                              px-3
                              py-1.5
                              text-sm
                              text-gray-700
                              outline-none
                              focus:border-pink-300
                              focus:ring-2
                              focus:ring-pink-100
                            "
                            aria-label="Редактирование подзадачи"
                          />

                          <div
                            className="
                              flex
                              shrink-0
                              gap-1
                            "
                          >
                            <button
                              type="button"
                              onClick={
                                saveSubtaskEditing
                              }
                              disabled={
                                subtaskSaveIsDisabled
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-green-50
                                text-green-600
                                transition
                                hover:bg-green-100
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                              "
                              aria-label="Сохранить подзадачу"
                              title="Сохранить"
                            >
                              ✓
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelSubtaskEditing
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-gray-100
                                text-gray-500
                                transition
                                hover:bg-gray-200
                              "
                              aria-label="Отменить редактирование подзадачи"
                              title="Отменить"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
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
                            {
                              subtask.text
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              startSubtaskEditing(
                                subtask.id,
                                subtask.text
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
                              hover:bg-pink-50
                            "
                            aria-label="Редактировать подзадачу"
                            title="Редактировать подзадачу"
                          >
                            ✏️
                          </button>

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
                        </>
                      )}
                    </div>
                  );
                }
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
                  value={
                    subtaskInput
                  }
                  onChange={(
                    event
                  ) =>
                    setSubtaskInput(
                      event.target
                        .value
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
                  onClick={
                    addNewSubtask
                  }
                  disabled={
                    subtaskInput
                      .trim()
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
          </div>
        </div>
      )}
    </div>
  );
}