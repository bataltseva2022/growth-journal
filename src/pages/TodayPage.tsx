import type {
  ComponentProps,
} from "react";

import Calendar from "../components/Calendar";
import PeriodStats from "../components/PeriodStats";
import TaskPanel from "../components/TaskPanel";

type TaskPanelProps =
  ComponentProps<typeof TaskPanel>;

type CalendarProps =
  ComponentProps<typeof Calendar>;

type Props = Omit<
  TaskPanelProps,
  "tasks"
> & {
  dayTasks:
    TaskPanelProps["tasks"];
  allTasks:
    CalendarProps["tasks"];
  onSelectDate:
    CalendarProps["onSelectDate"];
  calendarIcon:
    CalendarProps["calendarIcon"];
  taskMarkerIcon:
    CalendarProps["taskMarkerIcon"];
};

export default function TodayPage({
  dayTasks,
  allTasks,
  onSelectDate,
  calendarIcon,
  taskMarkerIcon,
  ...taskPanelProps
}: Props) {
  const { selectedDate } =
    taskPanelProps;

  return (
    <>
      <PeriodStats
        tasks={allTasks}
        selectedDate={selectedDate}
      />

      <section
        className="
          grid
          grid-cols-1
          items-start
          gap-6
          lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]
        "
      >
        <TaskPanel
          {...taskPanelProps}
          tasks={dayTasks}
        />

        <Calendar
          tasks={allTasks}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          calendarIcon={calendarIcon}
          taskMarkerIcon={
            taskMarkerIcon
          }
        />
      </section>
    </>
  );
}