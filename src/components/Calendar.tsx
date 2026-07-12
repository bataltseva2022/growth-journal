import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Task } from "../types/task";

import {
  formatDate,
  getMonthDays,
  getToday,
  parseDate,
} from "../utils/date";

type Props = {
  tasks: Task[];
  selectedDate: string;

  onSelectDate: (date: string) => void;

  calendarIcon: string;
  taskMarkerIcon: string;
};

const weekDayNames = [
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
  "Вс",
];

export default function Calendar({
  tasks,
  selectedDate,
  onSelectDate,
  calendarIcon,
  taskMarkerIcon,
}: Props) {
  const today = getToday();

  const [displayedMonth, setDisplayedMonth] =
    useState<Date>(() => {
      const selected = parseDate(selectedDate);

      return new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      );
    });

  /*
   * Если дата меняется через недельную доску,
   * кнопку «Сегодня» или другой компонент,
   * календарь открывает соответствующий месяц.
   */
  useEffect(() => {
    const selected = parseDate(selectedDate);

    setDisplayedMonth(
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      )
    );
  }, [selectedDate]);

  const displayedYear =
    displayedMonth.getFullYear();

  const displayedMonthIndex =
    displayedMonth.getMonth();

  const monthName =
    displayedMonth.toLocaleDateString(
      "ru-RU",
      {
        month: "long",
      }
    );

  const monthDays = useMemo(
    () =>
      getMonthDays(
        displayedYear,
        displayedMonthIndex
      ),
    [
      displayedYear,
      displayedMonthIndex,
    ]
  );

  const taskCountByDate = useMemo(() => {
    const counts =
      new Map<string, number>();

    tasks.forEach((task) => {
      const currentCount =
        counts.get(task.date) ?? 0;

      counts.set(
        task.date,
        currentCount + 1
      );
    });

    return counts;
  }, [tasks]);

  const completedTaskCountByDate =
    useMemo(() => {
      const counts =
        new Map<string, number>();

      tasks.forEach((task) => {
        if (!task.done) {
          return;
        }

        const currentCount =
          counts.get(task.date) ?? 0;

        counts.set(
          task.date,
          currentCount + 1
        );
      });

      return counts;
    }, [tasks]);

  function goToPreviousMonth() {
    setDisplayedMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
    );
  }

  function goToNextMonth() {
    setDisplayedMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
    );
  }

  function goToToday() {
    const todayString = getToday();
    const todayDate =
      parseDate(todayString);

    setDisplayedMonth(
      new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        1
      )
    );

    onSelectDate(todayString);
  }

  return (
    <section
      className="
        mb-8
        rounded-3xl
        bg-white/70
        p-4
        shadow-lg
        backdrop-blur-md
        sm:p-6
      "
    >
      {/* Заголовок и переключение месяца */}
      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2 className="text-2xl font-bold capitalize text-gray-800">
            {calendarIcon} {monthName}{" "}
            {displayedYear}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Выбери день, чтобы посмотреть или
            добавить задачи
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-pink-200
              bg-white/80
              text-lg
              font-semibold
              text-gray-600
              transition
              hover:bg-pink-50
              active:scale-95
            "
            aria-label="Предыдущий месяц"
            title="Предыдущий месяц"
          >
            ←
          </button>

          <div
            className="
              min-w-[175px]
              rounded-xl
              bg-pink-50
              px-4
              py-2
              text-center
              font-bold
              capitalize
              text-gray-700
            "
          >
            {monthName} {displayedYear}
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-pink-200
              bg-white/80
              text-lg
              font-semibold
              text-gray-600
              transition
              hover:bg-pink-50
              active:scale-95
            "
            aria-label="Следующий месяц"
            title="Следующий месяц"
          >
            →
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="
              rounded-xl
              bg-pink-500
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-pink-600
              active:scale-95
            "
          >
            Сегодня
          </button>
        </div>
      </div>

      {/* Один месяц */}
      <div
        className="
          mx-auto
          max-w-4xl
          rounded-2xl
          border
          border-pink-100
          bg-white/80
          p-3
          shadow-sm
          sm:p-5
        "
      >
        {/* Дни недели */}
        <div
          className="
            mb-2
            grid
            grid-cols-7
            gap-1
            text-center
          "
        >
          {weekDayNames.map(
            (weekDayName, index) => (
              <div
                key={weekDayName}
                className={`
                  py-2
                  text-xs
                  font-semibold
                  sm:text-sm
                  ${
                    index >= 5
                      ? "text-pink-500"
                      : "text-gray-400"
                  }
                `}
              >
                {weekDayName}
              </div>
            )
          )}
        </div>

        {/* Дни месяца */}
        <div
          className="
            grid
            grid-cols-7
            gap-1.5
            sm:gap-2
          "
        >
          {monthDays.map(
            (day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="
                      aspect-square
                      min-h-[44px]
                    "
                  />
                );
              }

              const dateString =
                formatDate(day);

              const isSelected =
                dateString === selectedDate;

              const isToday =
                dateString === today;

              const taskCount =
                taskCountByDate.get(
                  dateString
                ) ?? 0;

              const completedCount =
                completedTaskCountByDate.get(
                  dateString
                ) ?? 0;

              const hasTasks =
                taskCount > 0;

              const allTasksCompleted =
                hasTasks &&
                completedCount === taskCount;

              const dayOfWeek =
                day.getDay();

              const isWeekend =
                dayOfWeek === 0 ||
                dayOfWeek === 6;

              return (
                <button
                  key={dateString}
                  type="button"
                  onClick={() =>
                    onSelectDate(dateString)
                  }
                  className={`
                    relative
                    flex
                    aspect-square
                    min-h-[44px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    text-sm
                    font-medium
                    transition
                    sm:min-h-[62px]
                    sm:text-base
                    ${
                      isSelected
                        ? "border-pink-500 bg-pink-500 text-white shadow-md"
                        : hasTasks
                          ? "border-pink-200 bg-pink-50 text-gray-700 hover:bg-pink-100"
                          : "border-transparent bg-white/50 hover:border-pink-100 hover:bg-pink-50"
                    }
                    ${
                      isToday
                        ? "ring-2 ring-pink-200"
                        : ""
                    }
                    ${
                      isWeekend &&
                      !isSelected
                        ? "text-pink-500"
                        : ""
                    }
                  `}
                  title={
                    hasTasks
                      ? `${taskCount} задач, выполнено ${completedCount}`
                      : dateString
                  }
                >
                  <span>
                    {day.getDate()}
                  </span>

                  {hasTasks && (
                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        min-h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        px-1
                        text-[10px]
                        leading-none
                        text-gray-700
                        shadow-sm
                        sm:min-h-6
                        sm:min-w-6
                        sm:text-xs
                      "
                      title={`${taskCount} задач`}
                    >
                      {allTasksCompleted
                        ? "✅"
                        : taskCount === 1
                          ? taskMarkerIcon
                          : taskCount}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Подсказки */}
      <div
        className="
          mt-5
          flex
          flex-wrap
          gap-x-5
          gap-y-2
          rounded-2xl
          bg-white/60
          px-4
          py-3
          text-xs
          text-gray-500
        "
      >
        <span>
          {taskMarkerIcon} есть задача
        </span>

        <span>
          Число в кружке — количество задач
        </span>

        <span>
          ✅ все задачи выполнены
        </span>

        <span>
          Цветной день — выбранная дата
        </span>

        <span>
          Обводка — сегодняшний день
        </span>
      </div>
    </section>
  );
}