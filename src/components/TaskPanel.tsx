import {
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

import TaskFilters from "./TaskFilters";
import type { TaskStatusFilter } from "./TaskFilters";
import TaskItem from "./TaskItem";
import TaskStats from "./TaskStats";

import type { Project, Topic } from "../types/organization";
import type { Task } from "../types/task";
import { parseDate } from "../utils/date";

type Props = {
  selectedDate: string;
  dayIcon: string;

  taskText: string;
  onTaskTextChange: (text: string) => void;
  onAddTask: () => void;

  tasks: Task[];

  projects: Project[];
  topics: Topic[];

  selectedProjectId: number | null;
  selectedTopicId: number | null;

  onProjectChange: (projectId: number | null) => void;
  onTopicChange: (topicId: number | null) => void;

  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleExpand: (id: number) => void;

  onToggleSubtask: (
    taskId: number,
    subId: number
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

type TaskGroup = {
  key: string;

  projectName: string;
  projectColor: string | null;

  topicName: string;
  topicColor: string | null;

  tasks: Task[];
};

export default function TaskPanel({
  selectedDate,
  dayIcon,
  taskText,
  onTaskTextChange,
  onAddTask,
  tasks,
  projects,
  topics,
  selectedProjectId,
  selectedTopicId,
  onProjectChange,
  onTopicChange,
  onToggle,
  onDelete,
  onToggleExpand,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
}: Props) {
  const [projectFilter, setProjectFilter] =
    useState("all");

  const [topicFilter, setTopicFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState<TaskStatusFilter>("all");

  const date = parseDate(selectedDate);

  const title = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      let matchesProject = true;

      if (projectFilter === "none") {
        matchesProject = task.projectId === null;
      } else if (projectFilter !== "all") {
        matchesProject =
          task.projectId === Number(projectFilter);
      }

      let matchesTopic = true;

      if (topicFilter === "none") {
        matchesTopic = task.topicId === null;
      } else if (topicFilter !== "all") {
        matchesTopic =
          task.topicId === Number(topicFilter);
      }

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = !task.done;
      } else if (statusFilter === "completed") {
        matchesStatus = task.done;
      }

      return (
        matchesProject &&
        matchesTopic &&
        matchesStatus
      );
    });
  }, [
    tasks,
    projectFilter,
    topicFilter,
    statusFilter,
  ]);

  const taskGroups = useMemo(() => {
    const groups = new Map<string, TaskGroup>();

    filteredTasks.forEach((task) => {
      const project = projects.find(
        (item) => item.id === task.projectId
      );

      const topic = topics.find(
        (item) => item.id === task.topicId
      );

      const projectKey =
        task.projectId === null
          ? "no-project"
          : String(task.projectId);

      const topicKey =
        task.topicId === null
          ? "no-topic"
          : String(task.topicId);

      const groupKey = `${projectKey}-${topicKey}`;

      const existingGroup = groups.get(groupKey);

      if (existingGroup) {
        existingGroup.tasks.push(task);
        return;
      }

      groups.set(groupKey, {
        key: groupKey,
        projectName: project?.name ?? "Без проекта",
        projectColor: project?.color ?? null,
        topicName: topic?.name ?? "Без темы",
        topicColor: topic?.color ?? null,
        tasks: [task],
      });
    });

    return Array.from(groups.values()).sort(
      (first, second) => {
        const projectComparison =
          first.projectName.localeCompare(
            second.projectName,
            "ru"
          );

        if (projectComparison !== 0) {
          return projectComparison;
        }

        return first.topicName.localeCompare(
          second.topicName,
          "ru"
        );
      }
    );
  }, [filteredTasks, projects, topics]);

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      onAddTask();
    }
  }

  function resetFilters() {
    setProjectFilter("all");
    setTopicFilter("all");
    setStatusFilter("all");
  }

  const filtersAreActive =
    projectFilter !== "all" ||
    topicFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div
      className="
        h-full
        rounded-3xl
        bg-white/70
        p-6
        shadow-lg
        backdrop-blur-md
      "
    >
      <h2
        className="
          mb-1
          text-2xl
          font-bold
          capitalize
          text-gray-800
        "
      >
        {dayIcon} {title}
      </h2>

      <p className="mb-5 text-sm text-gray-500">
        Задачи выбранного дня
      </p>

      <TaskStats tasks={tasks} />

      {/* Создание новой задачи */}
      <div
        className="
          mb-5
          rounded-2xl
          border
          border-pink-100
          bg-white/60
          p-4
        "
      >
        <div className="flex gap-2">
          <input
            className="
              min-w-0
              flex-1
              rounded-xl
              border
              border-pink-200
              bg-white/90
              p-3
              outline-none
              transition
              focus:border-pink-300
              focus:ring-2
              focus:ring-pink-200
            "
            placeholder="Новая задача..."
            value={taskText}
            onChange={(event) =>
              onTaskTextChange(event.target.value)
            }
            onKeyDown={handleInputKeyDown}
          />

          <button
            type="button"
            onClick={onAddTask}
            className="
              rounded-xl
              bg-pink-500
              px-5
              text-xl
              font-semibold
              text-white
              transition
              hover:bg-pink-600
              active:scale-95
            "
            aria-label="Добавить задачу"
            title="Добавить задачу"
          >
            +
          </button>
        </div>

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
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
              Проект новой задачи
            </span>

            <select
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
                focus:border-pink-300
                focus:ring-2
                focus:ring-pink-100
              "
              value={selectedProjectId ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onProjectChange(
                  value ? Number(value) : null
                );
              }}
            >
              <option value="">
                Без проекта
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
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
              Тема новой задачи
            </span>

            <select
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
                focus:border-violet-300
                focus:ring-2
                focus:ring-violet-100
              "
              value={selectedTopicId ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onTopicChange(
                  value ? Number(value) : null
                );
              }}
            >
              <option value="">
                Без темы
              </option>

              {topics.map((topic) => (
                <option
                  key={topic.id}
                  value={topic.id}
                >
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Фильтры списка */}
      <TaskFilters
        projects={projects}
        topics={topics}
        projectFilter={projectFilter}
        topicFilter={topicFilter}
        statusFilter={statusFilter}
        onProjectFilterChange={setProjectFilter}
        onTopicFilterChange={setTopicFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={resetFilters}
      />

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
          text-xs
          text-gray-400
        "
      >
        <span>
          Показано: {filteredTasks.length} из{" "}
          {tasks.length}
        </span>

        {filtersAreActive && (
          <span>Фильтры включены</span>
        )}
      </div>

      {/* Список задач */}
      <div
        className="
          max-h-[700px]
          space-y-5
          overflow-y-auto
          pr-2
        "
      >
        {tasks.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-pink-200
              py-10
              text-center
              text-gray-400
            "
          >
            <div className="mb-2 text-3xl">
              {dayIcon}
            </div>

            <p>На этот день задач пока нет</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-gray-200
              py-10
              text-center
              text-gray-400
            "
          >
            <div className="mb-2 text-3xl">
              🔎
            </div>

            <p>
              По выбранным фильтрам задач нет
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="
                mt-3
                rounded-xl
                bg-pink-50
                px-4
                py-2
                text-sm
                text-pink-600
                transition
                hover:bg-pink-100
              "
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          taskGroups.map((group) => (
            <section key={group.key}>
              <div
                className="
                  mb-2
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/90
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-gray-700
                    shadow-sm
                  "
                >
                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        group.projectColor ??
                        "#d1d5db",
                    }}
                  />

                  {group.projectName}
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/90
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-gray-500
                    shadow-sm
                  "
                >
                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        group.topicColor ??
                        "#d1d5db",
                    }}
                  />

                  {group.topicName}
                </div>

                <span className="text-xs text-gray-400">
                  {group.tasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {group.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onToggleExpand={
                      onToggleExpand
                    }
                    onToggleSubtask={
                      onToggleSubtask
                    }
                    onDeleteSubtask={
                      onDeleteSubtask
                    }
                    onAddSubtask={
                      onAddSubtask
                    }
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}