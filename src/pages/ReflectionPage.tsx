import type {
  ComponentProps,
} from "react";

import Calendar from "../components/Calendar";
import ReflectionPanel from "../components/ReflectionPanel";

type ReflectionPanelProps =
  ComponentProps<typeof ReflectionPanel>;

type CalendarProps =
  ComponentProps<typeof Calendar>;

type Props = {
  selectedDate:
    ReflectionPanelProps["selectedDate"];
  reflection:
    ReflectionPanelProps["reflection"];
  theme:
    ReflectionPanelProps["theme"];
  onFieldChange:
    ReflectionPanelProps["onFieldChange"];
  onMoodChange:
    ReflectionPanelProps["onMoodChange"];
  onClear:
    ReflectionPanelProps["onClear"];

  tasks:
    CalendarProps["tasks"];
  onSelectDate:
    CalendarProps["onSelectDate"];
  calendarIcon:
    CalendarProps["calendarIcon"];
  taskMarkerIcon:
    CalendarProps["taskMarkerIcon"];
};

export default function ReflectionPage({
  selectedDate,
  reflection,
  theme,
  onFieldChange,
  onMoodChange,
  onClear,
  tasks,
  onSelectDate,
  calendarIcon,
  taskMarkerIcon,
}: Props) {
  return (
    <section className="space-y-6">
      <div
        className="
          grid
          grid-cols-1
          items-start
          gap-6
          lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.55fr)]
        "
      >
        <ReflectionPanel
          selectedDate={selectedDate}
          reflection={reflection}
          theme={theme}
          onFieldChange={onFieldChange}
          onMoodChange={onMoodChange}
          onClear={onClear}
        />

        <div className="space-y-6">
          <Calendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            calendarIcon={calendarIcon}
            taskMarkerIcon={
              taskMarkerIcon
            }
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
                font-bold
                text-gray-800
              "
            >
              💭 Дневник дня
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              Выбирай дату в календаре
              и сохраняй настроение,
              успехи, сложности и мысли
              об улучшениях.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}