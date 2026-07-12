import type {
  Project,
  Topic,
} from "../types/organization";

export type TaskStatusFilter =
  | "all"
  | "active"
  | "completed";

type Props = {
  projects: Project[];
  topics: Topic[];

  projectFilter: string;
  topicFilter: string;
  statusFilter: TaskStatusFilter;

  onProjectFilterChange: (
    value: string
  ) => void;

  onTopicFilterChange: (
    value: string
  ) => void;

  onStatusFilterChange: (
    value: TaskStatusFilter
  ) => void;

  onReset: () => void;
};

export default function TaskFilters({
  projects,
  topics,
  projectFilter,
  topicFilter,
  statusFilter,
  onProjectFilterChange,
  onTopicFilterChange,
  onStatusFilterChange,
  onReset,
}: Props) {
  const hasActiveFilters =
    projectFilter !== "all" ||
    topicFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div
      className="
        mb-5
        rounded-2xl
        border
        border-gray-100
        bg-white/60
        p-4
      "
    >
      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <h3
          className="
            text-sm
            font-semibold
            text-gray-700
          "
        >
          🔎 Фильтры
        </h3>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className={`
            rounded-lg
            px-3
            py-1
            text-xs
            transition
            ${
              hasActiveFilters
                ? "text-pink-600 hover:bg-pink-50"
                : "cursor-not-allowed text-gray-300"
            }
          `}
        >
          Сбросить
        </button>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-3
        "
      >
        <label className="block">
          <span
            className="
              mb-1
              block
              text-xs
              font-medium
              text-gray-500
            "
          >
            Проект
          </span>

          <select
            value={projectFilter}
            onChange={(event) =>
              onProjectFilterChange(
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-pink-100
              bg-white/90
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
          >
            <option value="all">
              Все проекты
            </option>

            <option value="none">
              Без проекта
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={String(project.id)}
              >
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span
            className="
              mb-1
              block
              text-xs
              font-medium
              text-gray-500
            "
          >
            Тема
          </span>

          <select
            value={topicFilter}
            onChange={(event) =>
              onTopicFilterChange(
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-violet-100
              bg-white/90
              px-3
              py-2
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-violet-300
              focus:ring-2
              focus:ring-violet-100
            "
          >
            <option value="all">
              Все темы
            </option>

            <option value="none">
              Без темы
            </option>

            {topics.map((topic) => (
              <option
                key={topic.id}
                value={String(topic.id)}
              >
                {topic.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span
            className="
              mb-1
              block
              text-xs
              font-medium
              text-gray-500
            "
          >
            Статус
          </span>

          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target
                  .value as TaskStatusFilter
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-green-100
              bg-white/90
              px-3
              py-2
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-green-300
              focus:ring-2
              focus:ring-green-100
            "
          >
            <option value="all">
              Все задачи
            </option>

            <option value="active">
              Только оставшиеся
            </option>

            <option value="completed">
              Только выполненные
            </option>
          </select>
        </label>
      </div>
    </div>
  );
}