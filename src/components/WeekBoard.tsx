import {
  useMemo,
  useState,
  type DragEvent,
  type PointerEvent,
} from "react";

import type { Task } from "../types/task";

import {
  formatDate,
  getToday,
  getWeekDays,
} from "../utils/date";

import TaskStats from "./TaskStats";

type Props = {
  tasks: Task[];
  selectedDate: string;
  dayIcon: string;

  onMoveTask: (
    taskId: number,
    newDate: string
  ) => void;

  onReorderTasks: (
    firstTaskId: number,
    secondTaskId: number
  ) => void;

  onOpenTask: (
    date: string
  ) => void;
};

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
  task: Task
): string | null {
  const duration =
    calculateDuration(
      task.startedAt,
      task.finishedAt
    );

  if (
    task.startedAt &&
    task.finishedAt &&
    duration !== null
  ) {
    return `${task.startedAt}–${task.finishedAt} · ${formatDuration(
      duration
    )}`;
  }

  if (task.startedAt) {
    return `С ${task.startedAt}`;
  }

  if (task.finishedAt) {
    return `До ${task.finishedAt}`;
  }

  return null;
}

export default function WeekBoard({
  tasks,
  selectedDate,
  dayIcon,
  onMoveTask,
  onReorderTasks,
  onOpenTask,
}: Props) {
  const [
    noteTask,
    setNoteTask,
  ] = useState<Task | null>(
    null
  );

  const today = getToday();

  const weekDays = useMemo(
    () => getWeekDays(selectedDate),
    [selectedDate]
  );

  const weekDateStrings = useMemo(
    () =>
      weekDays.map((day) =>
        formatDate(day)
      ),
    [weekDays]
  );

  const weekTasks = useMemo(
    () =>
      tasks.filter((task) =>
        weekDateStrings.includes(
          task.date
        )
      ),
    [tasks, weekDateStrings]
  );

  function getTasksByDate(
    date: string
  ): Task[] {
    return tasks.filter(
      (task) => task.date === date
    );
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    date: string
  ) {
    event.preventDefault();

    const taskId = Number(
      event.dataTransfer.getData(
        "taskId"
      )
    );

    if (!Number.isFinite(taskId)) {
      return;
    }

    onMoveTask(taskId, date);
  }

  function stopTaskDrag(
    event: PointerEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();
  }

  function openTask(
    date: string
  ) {
    setNoteTask(null);
    onOpenTask(date);
  }

  return (
    <div>
      <div
        className="
          mb-5
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-xl
              font-bold
              text-gray-800
            "
          >
            {dayIcon} План на неделю
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Перетаскивай задачи между
            днями, меняй их порядок или
            открывай подробности
          </p>
        </div>

        <TaskStats
          tasks={weekTasks}
          compact
        />
      </div>

      <div
        className="
          grid
          min-w-[1120px]
          grid-cols-7
          gap-3
        "
      >
        {weekDays.map((day) => {
          const dateStr =
            formatDate(day);

          const dayTasks =
            getTasksByDate(dateStr);

          const completedTaskCount =
            dayTasks.filter(
              (task) => task.done
            ).length;

          const remainingTaskCount =
            dayTasks.length -
            completedTaskCount;

          const daySubtasks =
            dayTasks.flatMap(
              (task) =>
                task.subtasks
            );

          const completedSubtaskCount =
            daySubtasks.filter(
              (subtask) =>
                subtask.done
            ).length;

          const remainingSubtaskCount =
            daySubtasks.length -
            completedSubtaskCount;

          const isSelected =
            dateStr === selectedDate;

          const isToday =
            dateStr === today;

          return (
            <div
              key={dateStr}
              className={`
                min-h-[300px]
                rounded-2xl
                border
                p-3
                transition-all
                duration-200
                ${
                  isSelected
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : "border-gray-200 bg-white/75"
                }
                ${
                  isToday
                    ? "ring-2 ring-pink-200"
                    : ""
                }
              `}
              onDragOver={(event) => {
                event.preventDefault();

                event.dataTransfer.dropEffect =
                  "move";
              }}
              onDrop={(event) =>
                handleDrop(
                  event,
                  dateStr
                )
              }
            >
              <div
                className="
                  mb-3
                  border-b
                  border-pink-100
                  pb-3
                  text-center
                "
              >
                <div
                  className="
                    mb-1
                    text-base
                  "
                >
                  {dayIcon}
                </div>

                <div
                  className="
                    text-xs
                    font-medium
                    uppercase
                    text-gray-500
                  "
                >
                  {day.toLocaleDateString(
                    "ru-RU",
                    {
                      weekday: "short",
                    }
                  )}
                </div>

                <div
                  className={`
                    mx-auto
                    mt-1
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-lg
                    font-bold
                    ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : "text-gray-800"
                    }
                  `}
                >
                  {day.getDate()}
                </div>

                <div
                  className="
                    mt-2
                    space-y-1
                    text-[11px]
                    text-gray-400
                  "
                >
                  <div>
                    Задачи: ✅{" "}
                    {completedTaskCount}
                    {" · "}
                    📌{" "}
                    {remainingTaskCount}
                  </div>

                  <div>
                    Подзадачи: ✅{" "}
                    {completedSubtaskCount}
                    {" · "}
                    📌{" "}
                    {remainingSubtaskCount}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dayTasks.length === 0 ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-gray-200
                      px-2
                      py-5
                      text-center
                      text-xs
                      text-gray-400
                    "
                  >
                    <div
                      className="
                        mb-1
                        text-base
                      "
                    >
                      {dayIcon}
                    </div>

                    Нет задач
                  </div>
                ) : (
                  dayTasks.map(
                    (
                      task,
                      taskIndex
                    ) => {
                      const previousTask =
                        dayTasks[
                          taskIndex - 1
                        ] ?? null;

                      const nextTask =
                        dayTasks[
                          taskIndex + 1
                        ] ?? null;

                      const timeSummary =
                        getTimeSummary(
                          task
                        );

                      const hasNote =
                        task.note.trim()
                          .length > 0;

                      return (
                        <article
                          key={task.id}
                          draggable
                          onDragStart={(
                            event
                          ) => {
                            event.dataTransfer.setData(
                              "taskId",
                              String(
                                task.id
                              )
                            );

                            event.dataTransfer.effectAllowed =
                              "move";
                          }}
                          className={`
                            cursor-move
                            rounded-xl
                            border
                            px-3
                            py-3
                            text-sm
                            transition
                            ${
                              task.done
                                ? "border-green-100 bg-green-50/80 text-gray-400 opacity-75"
                                : "border-pink-100 bg-pink-100 text-gray-700 hover:bg-pink-200"
                            }
                          `}
                          title="Перетащить задачу на другой день"
                        >
                          <div
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >
                            <span
                              className="
                                shrink-0
                              "
                            >
                              {task.done
                                ? "✓"
                                : "○"}
                            </span>

                            <span
                              className={`
                                min-w-0
                                flex-1
                                break-words
                                font-medium
                                ${
                                  task.done
                                    ? "line-through"
                                    : ""
                                }
                              `}
                            >
                              {task.text}
                            </span>

                            <div
                              className="
                                flex
                                shrink-0
                                flex-col
                                gap-1
                              "
                            >
                              <button
                                type="button"
                                draggable={
                                  false
                                }
                                disabled={
                                  previousTask ===
                                  null
                                }
                                onPointerDown={
                                  stopTaskDrag
                                }
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  if (
                                    previousTask
                                  ) {
                                    onReorderTasks(
                                      task.id,
                                      previousTask.id
                                    );
                                  }
                                }}
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-md
                                  bg-white/75
                                  text-xs
                                  font-bold
                                  text-gray-500
                                  shadow-sm
                                  transition
                                  hover:bg-pink-50
                                  hover:text-pink-600
                                  disabled:cursor-not-allowed
                                  disabled:opacity-25
                                "
                                aria-label="Переместить задачу выше"
                                title="Переместить выше"
                              >
                                ↑
                              </button>

                              <button
                                type="button"
                                draggable={
                                  false
                                }
                                disabled={
                                  nextTask ===
                                  null
                                }
                                onPointerDown={
                                  stopTaskDrag
                                }
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  if (
                                    nextTask
                                  ) {
                                    onReorderTasks(
                                      task.id,
                                      nextTask.id
                                    );
                                  }
                                }}
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-md
                                  bg-white/75
                                  text-xs
                                  font-bold
                                  text-gray-500
                                  shadow-sm
                                  transition
                                  hover:bg-pink-50
                                  hover:text-pink-600
                                  disabled:cursor-not-allowed
                                  disabled:opacity-25
                                "
                                aria-label="Переместить задачу ниже"
                                title="Переместить ниже"
                              >
                                ↓
                              </button>
                            </div>
                          </div>

                          <div
                            className="
                              mt-2
                              flex
                              flex-wrap
                              gap-1
                              border-t
                              border-black/5
                              pt-2
                            "
                          >
                            <button
                              type="button"
                              draggable={
                                false
                              }
                              onPointerDown={
                                stopTaskDrag
                              }
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                openTask(
                                  task.date
                                );
                              }}
                              className="
                                rounded-md
                                bg-white/75
                                px-2
                                py-1
                                text-[10px]
                                font-semibold
                                text-pink-600
                                shadow-sm
                                transition
                                hover:bg-white
                                hover:text-pink-700
                              "
                              aria-label="Открыть задачу во вкладке Сегодня"
                              title="Открыть задачу во вкладке Сегодня"
                            >
                              ↗ Открыть
                            </button>

                            {hasNote && (
                              <button
                                type="button"
                                draggable={
                                  false
                                }
                                onPointerDown={
                                  stopTaskDrag
                                }
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  setNoteTask(
                                    task
                                  );
                                }}
                                className="
                                  rounded-md
                                  bg-amber-50
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-semibold
                                  text-amber-700
                                  shadow-sm
                                  transition
                                  hover:bg-amber-100
                                "
                                aria-label="Открыть заметку"
                                title="Открыть заметку"
                              >
                                📝 Заметка
                              </button>
                            )}
                          </div>

                          {timeSummary && (
                            <div
                              className="
                                mt-2
                              "
                            >
                              <span
                                className="
                                  inline-block
                                  rounded-md
                                  bg-violet-50
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-medium
                                  text-violet-600
                                "
                              >
                                ⏱{" "}
                                {timeSummary}
                              </span>
                            </div>
                          )}

                          {task.subtasks
                            .length > 0 && (
                            <div
                              className="
                                mt-3
                                space-y-1.5
                                border-t
                                border-black/5
                                pt-2
                              "
                            >
                              {task.subtasks.map(
                                (
                                  subtask
                                ) => (
                                  <div
                                    key={
                                      subtask.id
                                    }
                                    className={`
                                      flex
                                      items-start
                                      gap-1.5
                                      rounded-lg
                                      px-2
                                      py-1.5
                                      text-[11px]
                                      ${
                                        subtask.done
                                          ? "bg-green-50/80 text-gray-400"
                                          : "bg-white/60 text-gray-600"
                                      }
                                    `}
                                  >
                                    <span
                                      className="
                                        shrink-0
                                      "
                                    >
                                      {subtask.done
                                        ? "✓"
                                        : "•"}
                                    </span>

                                    <span
                                      className={`
                                        min-w-0
                                        break-words
                                        ${
                                          subtask.done
                                            ? "line-through"
                                            : ""
                                        }
                                      `}
                                    >
                                      {
                                        subtask.text
                                      }
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </article>
                      );
                    }
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {noteTask && (
        <div
          className="
            fixed
            inset-0
            z-[120]
            flex
            items-center
            justify-center
            bg-black/25
            p-4
            backdrop-blur-[2px]
          "
          onClick={() =>
            setNoteTask(null)
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
              <div
                className="
                  min-w-0
                "
              >
                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-800
                  "
                >
                  📝 Заметка к задаче
                </h3>

                <p
                  className="
                    mt-1
                    break-words
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  {noteTask.text}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNoteTask(null)
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
                aria-label="Закрыть заметку"
                title="Закрыть"
              >
                ✕
              </button>
            </div>

            <div
              className="
                max-h-[50vh]
                overflow-y-auto
                whitespace-pre-wrap
                break-words
                rounded-2xl
                border
                border-amber-100
                bg-amber-50/50
                px-4
                py-4
                text-sm
                leading-6
                text-gray-700
              "
            >
              {noteTask.note}
            </div>

            <div
              className="
                mt-5
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setNoteTask(null)
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
                Закрыть
              </button>

              <button
                type="button"
                onClick={() =>
                  openTask(
                    noteTask.date
                  )
                }
                className="
                  rounded-xl
                  bg-pink-500
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                  active:scale-95
                "
              >
                Открыть задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}