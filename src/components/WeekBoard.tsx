import {
  useMemo,
  type DragEvent,
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
};

export default function WeekBoard({
  tasks,
  selectedDate,
  dayIcon,
  onMoveTask,
}: Props) {
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
        weekDateStrings.includes(task.date)
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
      event.dataTransfer.getData("taskId")
    );

    if (!Number.isFinite(taskId)) {
      return;
    }

    onMoveTask(taskId, date);
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
          <h2 className="text-xl font-bold text-gray-800">
            {dayIcon} План на неделю
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Перетаскивай основные задачи между днями
          </p>
        </div>

        <TaskStats
          tasks={weekTasks}
          compact
        />
      </div>

      <div className="grid min-w-[1120px] grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dateStr = formatDate(day);

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
              (task) => task.subtasks
            );

          const completedSubtaskCount =
            daySubtasks.filter(
              (subtask) => subtask.done
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
                handleDrop(event, dateStr)
              }
            >
              <div className="mb-3 border-b border-pink-100 pb-3 text-center">
                <div className="mb-1 text-base">
                  {dayIcon}
                </div>

                <div className="text-xs font-medium uppercase text-gray-500">
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

                <div className="mt-2 space-y-1 text-[11px] text-gray-400">
                  <div>
                    Задачи: ✅{" "}
                    {completedTaskCount}
                    {" · "}
                    📌 {remainingTaskCount}
                  </div>

                  <div>
                    Подзадачи: ✅{" "}
                    {completedSubtaskCount}
                    {" · "}
                    📌 {remainingSubtaskCount}
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
                    <div className="mb-1 text-base">
                      {dayIcon}
                    </div>

                    Нет задач
                  </div>
                ) : (
                  dayTasks.map((task) => (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          "taskId",
                          String(task.id)
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
                      <div className="flex items-start gap-2">
                        <span className="shrink-0">
                          {task.done
                            ? "✓"
                            : "○"}
                        </span>

                        <span
                          className={`
                            min-w-0
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
                      </div>

                      {task.subtasks.length >
                        0 && (
                        <div className="mt-3 space-y-1.5 border-t border-black/5 pt-2">
                          {task.subtasks.map(
                            (subtask) => (
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
                                <span className="shrink-0">
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
                                  {subtask.text}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}