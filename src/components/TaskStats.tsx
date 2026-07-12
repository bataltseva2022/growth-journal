import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
  compact?: boolean;
};

export default function TaskStats({
  tasks,
  compact = false,
}: Props) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.done
  ).length;

  const remainingTasks =
    totalTasks - completedTasks;

  const allSubtasks = tasks.flatMap(
    (task) => task.subtasks
  );

  const totalSubtasks = allSubtasks.length;

  const completedSubtasks = allSubtasks.filter(
    (subtask) => subtask.done
  ).length;

  const remainingSubtasks =
    totalSubtasks - completedSubtasks;

  const taskProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const subtaskProgress =
    totalSubtasks === 0
      ? 0
      : Math.round(
          (completedSubtasks / totalSubtasks) *
            100
        );

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">
            Задачи:
          </span>

          <span>✅ {completedTasks}</span>
          <span>📌 {remainingTasks}</span>
          <span>Всего: {totalTasks}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">
            Подзадачи:
          </span>

          <span>✅ {completedSubtasks}</span>
          <span>📌 {remainingSubtasks}</span>
          <span>Всего: {totalSubtasks}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 space-y-4 rounded-2xl border border-pink-100 bg-pink-50/70 p-4">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Основные задачи
          </h3>

          <span className="text-xs text-gray-500">
            {taskProgress}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <StatCard
            value={totalTasks}
            label="Всего"
            valueClassName="text-gray-800"
          />

          <StatCard
            value={completedTasks}
            label="Выполнено"
            valueClassName="text-green-600"
          />

          <StatCard
            value={remainingTasks}
            label="Осталось"
            valueClassName="text-pink-600"
          />
        </div>

        <ProgressBar progress={taskProgress} />
      </section>

      <section className="border-t border-pink-100 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Подзадачи
          </h3>

          <span className="text-xs text-gray-500">
            {subtaskProgress}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <StatCard
            value={totalSubtasks}
            label="Всего"
            valueClassName="text-gray-800"
          />

          <StatCard
            value={completedSubtasks}
            label="Выполнено"
            valueClassName="text-green-600"
          />

          <StatCard
            value={remainingSubtasks}
            label="Осталось"
            valueClassName="text-violet-600"
          />
        </div>

        <ProgressBar
          progress={subtaskProgress}
          barClassName="bg-violet-400"
          trackClassName="bg-violet-100"
        />
      </section>
    </div>
  );
}

type StatCardProps = {
  value: number;
  label: string;
  valueClassName: string;
};

function StatCard({
  value,
  label,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white/80 p-3">
      <div
        className={`text-xl font-bold ${valueClassName}`}
      >
        {value}
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {label}
      </div>
    </div>
  );
}

type ProgressBarProps = {
  progress: number;
  barClassName?: string;
  trackClassName?: string;
};

function ProgressBar({
  progress,
  barClassName = "bg-pink-400",
  trackClassName = "bg-white",
}: ProgressBarProps) {
  return (
    <div
      className={`mt-3 h-2 overflow-hidden rounded-full ${trackClassName}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barClassName}`}
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}