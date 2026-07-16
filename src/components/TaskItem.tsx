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

  onUpdateTaskNote: (
    taskId: number,
    note: string
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

function getTimeSummary(
  startedAt: string | null,
  finishedAt: string | null
): string | null {
  const duration =
    calculateDuration(
      startedAt,
      finishedAt
    );

  if (
    startedAt &&
    finishedAt &&
    duration !== null
  ) {
    return `${startedAt}–${finishedAt} · ${formatDuration(
      duration
    )}`;
  }

  if (startedAt) {
    return `С ${startedAt} · в процессе`;
  }

  if (finishedAt) {
    return `Закончила в ${finishedAt}`;
  }

  return null;
}

export default function TaskItem({
  task,
  onToggle,
  onEditTask,
  onUpdateTaskNote,
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

  const [
    isTimeWindowOpen,
    setIsTimeWindowOpen,
  ] = useState(false);

  const [
    isNoteWindowOpen,
    setIsNoteWindowOpen,
  ] = useState(false);

  const [
    noteDraft,
    setNoteDraft,
  ] = useState(task.note);

  const durationMinutes =
    calculateDuration(
      task.startedAt,
      task.finishedAt
    );

  const timeSummary =
    getTimeSummary(
      task.startedAt,
      task.finishedAt
    );

  const hasNote =
    task.note.trim().length > 0;

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

  function openNoteWindow() {
    setNoteDraft(task.note);
    setIsNoteWindowOpen(true);
  }

  function closeNoteWindow() {
    setNoteDraft(task.note);
    setIsNoteWindowOpen(false);
  }

  function saveNote() {
    onUpdateTaskNote(
      task.id,
      noteDraft
    );

    setIsNoteWindowOpen(false);
  }

  function deleteNote() {
    onUpdateTaskNote(
      task.id,
      ""
    );

    setNoteDraft("");
    setIsNoteWindowOpen(false);
  }

  function handleNoteKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      saveNote();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeNoteWindow();
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

  return (
    <>
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

                {(timeSummary ||
                  hasNote) && (
                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {timeSummary && (
                      <button
                        type="button"
                        onClick={() =>
                          setIsTimeWindowOpen(
                            true
                          )
                        }
                        className="
                          rounded-lg
                          border
                          border-violet-100
                          bg-violet-50/80
                          px-2.5
                          py-1
                          text-left
                          text-[11px]
                          font-medium
                          text-violet-600
                          transition
                          hover:bg-violet-100
                        "
                        title="Открыть время работы"
                      >
                        ⏱ {timeSummary}
                      </button>
                    )}

                    {hasNote && (
                      <button
                        type="button"
                        onClick={
                          openNoteWindow
                        }
                        className="
                          rounded-lg
                          border
                          border-amber-100
                          bg-amber-50/80
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          text-amber-700
                          transition
                          hover:bg-amber-100
                        "
                        title="Открыть заметку"
                      >
                        📝 Есть заметка
                      </button>
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
                flex-wrap
                items-center
                justify-end
                gap-1
              "
            >
              <button
                type="button"
                onClick={() =>
                  setIsTimeWindowOpen(
                    true
                  )
                }
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  transition
                  ${
                    timeSummary
                      ? "bg-violet-50"
                      : "hover:bg-violet-50"
                  }
                `}
                aria-label="Указать время работы"
                title="Время работы"
              >
                ⏱️
              </button>

              <button
                type="button"
                onClick={
                  openNoteWindow
                }
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  transition
                  ${
                    hasNote
                      ? "bg-amber-50"
                      : "hover:bg-amber-50"
                  }
                `}
                aria-label="Добавить заметку"
                title="Заметка"
              >
                📝
              </button>

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
              border-l-2
              border-pink-100
              pl-5
            "
          >
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
                            {subtask.text}
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
        )}
      </div>

      {isTimeWindowOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/20
            p-4
            backdrop-blur-[2px]
          "
          onClick={() =>
            setIsTimeWindowOpen(
              false
            )
          }
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/80
              bg-white
              p-5
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                mb-5
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-800
                  "
                >
                  ⏱️ Время работы
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  {task.text}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsTimeWindowOpen(
                    false
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-500
                  transition
                  hover:bg-gray-200
                  hover:text-gray-800
                "
                aria-label="Закрыть окно времени"
                title="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="
                  rounded-2xl
                  border
                  border-pink-100
                  bg-pink-50/40
                  p-4
                "
              >
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Начала работать
                </label>

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
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
                      rounded-xl
                      border
                      border-pink-200
                      bg-white
                      px-3
                      py-2.5
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
                      rounded-xl
                      bg-pink-100
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-pink-700
                      transition
                      hover:bg-pink-200
                    "
                  >
                    Сейчас
                  </button>
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-violet-100
                  bg-violet-50/40
                  p-4
                "
              >
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Закончила работать
                </label>

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
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
                      rounded-xl
                      border
                      border-violet-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-700
                      outline-none
                      focus:border-violet-300
                      focus:ring-2
                      focus:ring-violet-100
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
                      rounded-xl
                      bg-violet-100
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-violet-700
                      transition
                      hover:bg-violet-200
                    "
                  >
                    Сейчас
                  </button>
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50
                  p-4
                "
              >
                <span
                  className="
                    block
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Потрачено времени
                </span>

                <strong
                  className="
                    mt-1
                    block
                    text-base
                    text-gray-700
                  "
                >
                  {durationMinutes !==
                  null
                    ? formatDuration(
                        durationMinutes
                      )
                    : task.startedAt
                      ? `В процессе с ${task.startedAt}`
                      : task.finishedAt
                        ? `Завершено в ${task.finishedAt}`
                        : "Время пока не указано"}
                </strong>
              </div>

              {(task.startedAt ||
                task.finishedAt) && (
                <button
                  type="button"
                  onClick={() =>
                    onClearTaskTime(
                      task.id
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-red-500
                    transition
                    hover:bg-red-100
                  "
                >
                  Сбросить время
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isNoteWindowOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/20
            p-4
            backdrop-blur-[2px]
          "
          onClick={
            closeNoteWindow
          }
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              border
              border-white/80
              bg-white
              p-5
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                mb-4
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-800
                  "
                >
                  📝 Заметка
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  {task.text}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeNoteWindow
                }
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-500
                  transition
                  hover:bg-gray-200
                  hover:text-gray-800
                "
                aria-label="Закрыть окно заметки"
                title="Закрыть"
              >
                ✕
              </button>
            </div>

            <textarea
              value={noteDraft}
              onChange={(event) =>
                setNoteDraft(
                  event.target.value
                )
              }
              onKeyDown={
                handleNoteKeyDown
              }
              autoFocus
              rows={8}
              placeholder="Ссылки, детали, результаты проверки, важные мысли..."
              className="
                w-full
                resize-y
                rounded-2xl
                border
                border-amber-200
                bg-amber-50/30
                px-4
                py-3
                text-sm
                leading-6
                text-gray-700
                outline-none
                transition
                focus:border-amber-300
                focus:ring-2
                focus:ring-amber-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Ctrl + Enter — сохранить
            </p>

            <div
              className="
                mt-4
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-between
              "
            >
              {hasNote ? (
                <button
                  type="button"
                  onClick={deleteNote}
                  className="
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-red-500
                    transition
                    hover:bg-red-100
                  "
                >
                  Удалить заметку
                </button>
              ) : (
                <div />
              )}

              <div
                className="
                  flex
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={
                    closeNoteWindow
                  }
                  className="
                    rounded-xl
                    bg-gray-100
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-200
                  "
                >
                  Отменить
                </button>

                <button
                  type="button"
                  onClick={saveNote}
                  className="
                    rounded-xl
                    bg-amber-400
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-amber-500
                    active:scale-95
                  "
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}