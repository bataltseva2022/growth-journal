import type {
  ComponentProps,
} from "react";

import Calendar from "../components/Calendar";
import PeriodStats from "../components/PeriodStats";

type CalendarProps =
  ComponentProps<typeof Calendar>;

type PeriodStatsProps =
  ComponentProps<typeof PeriodStats>;

type Props = {
  tasks: CalendarProps["tasks"];
  selectedDate: CalendarProps["selectedDate"];
  onSelectDate: CalendarProps["onSelectDate"];
  calendarIcon: CalendarProps["calendarIcon"];
  taskMarkerIcon: CalendarProps["taskMarkerIcon"];
  dayIcon: string;
  onOpenToday: () => void;
};

export default function CalendarPage({
  tasks,
  selectedDate,
  onSelectDate,
  calendarIcon,
  taskMarkerIcon,
  dayIcon,
  onOpenToday,
}: Props) {
  return (
    <section className="space-y-6">
      <div
        className="
          rounded-3xl
          bg-white/65
          p-5
          shadow-lg
          backdrop-blur-sm
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          {calendarIcon} Календарь
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Выбери день, чтобы посмотреть
          его задачи и статистику
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          items-start
          gap-6
          lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]
        "
      >
        <Calendar
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          calendarIcon={calendarIcon}
          taskMarkerIcon={taskMarkerIcon}
        />

        <div className="space-y-6">
          <PeriodStats
            tasks={
              tasks as PeriodStatsProps["tasks"]
            }
            selectedDate={selectedDate}
          />

          <div
            className="
              rounded-3xl
              bg-white/65
              p-5
              shadow-lg
              backdrop-blur-sm
            "
          >
            <h3
              className="
                text-lg
                font-bold
                text-gray-800
              "
            >
              {dayIcon} Выбранный день
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              После выбора даты перейди
              в раздел «Сегодня», чтобы
              добавить или изменить
              задачи этого дня.
            </p>

            <button
              type="button"
              onClick={onOpenToday}
              className="
                mt-4
                rounded-2xl
                bg-pink-500
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-pink-600
                active:scale-95
              "
            >
              Открыть задачи дня
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}