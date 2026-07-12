import { useMemo } from "react";
import type { Task } from "../types/task";
import {
  formatDate,
  getWeekDays,
  parseDate,
} from "../utils/date";

type Props = {
  tasks: Task[];
  selectedDate: string;
};

type ItemStats = {
  total: number;
  completed: number;
  remaining: number;
  progress: number;
};

type PeriodStat = {
  title: string;
  subtitle: string;
  tasks: ItemStats;
  subtasks: ItemStats;
};

function calculateItemStats(
  total: number,
  completed: number
): ItemStats {
  const remaining = total - completed;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    remaining,
    progress,
  };
}

function calculatePeriodStats(
  title: string,
  subtitle: string,
  tasks: Task[]
): PeriodStat {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.done
  ).length;

  const subtasks = tasks.flatMap(
    (task) => task.subtasks
  );

  const totalSubtasks = subtasks.length;

  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.done
  ).length;

  return {
    title,
    subtitle,

    tasks: calculateItemStats(
      totalTasks,
      completedTasks
    ),

    subtasks: calculateItemStats(
      totalSubtasks,
      completedSubtasks
    ),
  };
}

function getMonthPrefix(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}-`;
}

function getYearPrefix(date: Date): string {
  return `${date.getFullYear()}-`;
}

function formatWeekSubtitle(
  weekDays: Date[]
): string {
  const firstDay = weekDays[0];
  const lastDay = weekDays[6];

  const firstLabel =
    firstDay.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });

  const lastLabel =
    lastDay.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });

  return `${firstLabel} — ${lastLabel}`;
}

export default function PeriodStats({
  tasks,
  selectedDate,
}: Props) {
  const periodStats = useMemo(() => {
    const selected = parseDate(selectedDate);

    const weekDays = getWeekDays(selectedDate);

    const weekDateSet = new Set(
      weekDays.map((day) => formatDate(day))
    );

    const monthPrefix =
      getMonthPrefix(selected);

    const yearPrefix =
      getYearPrefix(selected);

    const weekTasks = tasks.filter((task) =>
      weekDateSet.has(task.date)
    );

    const monthTasks = tasks.filter((task) =>
      task.date.startsWith(monthPrefix)
    );

    const yearTasks = tasks.filter((task) =>
      task.date.startsWith(yearPrefix)
    );

    const monthTitle =
      selected.toLocaleDateString("ru-RU", {
        month: "long",
        year: "numeric",
      });

    return [
      calculatePeriodStats(
        "Неделя",
        formatWeekSubtitle(weekDays),
        weekTasks
      ),

      calculatePeriodStats(
        "Месяц",
        monthTitle,
        monthTasks
      ),

      calculatePeriodStats(
        "Год",
        String(selected.getFullYear()),
        yearTasks
      ),
    ];
  }, [tasks, selectedDate]);

  return (
    <section className="mb-8 rounded-3xl bg-white/65 p-4 shadow-lg backdrop-blur-md sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          📊 Статистика задач
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Основные задачи и подзадачи относительно
          выбранной даты
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {periodStats.map((period) => (
          <PeriodCard
            key={period.title}
            period={period}
          />
        ))}
      </div>
    </section>
  );
}

type PeriodCardProps = {
  period: PeriodStat;
};

function PeriodCard({
  period,
}: PeriodCardProps) {
  return (
    <article className="rounded-2xl border border-pink-100 bg-white/80 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {period.title}
        </h3>

        <p className="mt-1 capitalize text-xs text-gray-400">
          {period.subtitle}
        </p>
      </div>

      <PeriodItemSection
        title="Задачи"
        stats={period.tasks}
        accent="pink"
      />

      <div className="my-4 border-t border-gray-100" />

      <PeriodItemSection
        title="Подзадачи"
        stats={period.subtasks}
        accent="violet"
      />
    </article>
  );
}

type PeriodItemSectionProps = {
  title: string;
  stats: ItemStats;
  accent: "pink" | "violet";
};

function PeriodItemSection({
  title,
  stats,
  accent,
}: PeriodItemSectionProps) {
  const remainingClassName =
    accent === "pink"
      ? "text-pink-600"
      : "text-violet-600";

  const trackClassName =
    accent === "pink"
      ? "bg-pink-100"
      : "bg-violet-100";

  const barClassName =
    accent === "pink"
      ? "bg-pink-400"
      : "bg-violet-400";

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          {title}
        </h4>

        <span className="text-xs text-gray-400">
          {stats.progress}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatValue
          value={stats.total}
          label="Всего"
          valueClassName="text-gray-800"
        />

        <StatValue
          value={stats.completed}
          label="Готово"
          valueClassName="text-green-600"
        />

        <StatValue
          value={stats.remaining}
          label="Осталось"
          valueClassName={remainingClassName}
        />
      </div>

      <div
        className={`mt-3 h-2 overflow-hidden rounded-full ${trackClassName}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barClassName}`}
          style={{
            width: `${stats.progress}%`,
          }}
        />
      </div>
    </section>
  );
}

type StatValueProps = {
  value: number;
  label: string;
  valueClassName: string;
};

function StatValue({
  value,
  label,
  valueClassName,
}: StatValueProps) {
  return (
    <div className="rounded-xl bg-gray-50/80 px-2 py-3 text-center">
      <div
        className={`text-xl font-bold ${valueClassName}`}
      >
        {value}
      </div>

      <div className="mt-1 text-[11px] text-gray-500">
        {label}
      </div>
    </div>
  );
}