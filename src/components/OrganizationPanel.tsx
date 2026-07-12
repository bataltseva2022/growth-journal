import { useState } from "react";
import type {
  Project,
  Topic,
} from "../types/organization";

type Props = {
  projects: Project[];
  topics: Topic[];

  onAddProject: (
    name: string,
    color: string
  ) => void;

  onDeleteProject: (
    projectId: number
  ) => void;

  onAddTopic: (
    name: string,
    color: string
  ) => void;

  onDeleteTopic: (
    topicId: number
  ) => void;
};

export default function OrganizationPanel({
  projects,
  topics,
  onAddProject,
  onDeleteProject,
  onAddTopic,
  onDeleteTopic,
}: Props) {
  const [projectName, setProjectName] =
    useState("");

  const [projectColor, setProjectColor] =
    useState("#f9a8d4");

  const [topicName, setTopicName] =
    useState("");

  const [topicColor, setTopicColor] =
    useState("#c4b5fd");

  function handleAddProject() {
    const trimmedName = projectName.trim();

    if (!trimmedName) {
      return;
    }

    onAddProject(
      trimmedName,
      projectColor
    );

    setProjectName("");
  }

  function handleAddTopic() {
    const trimmedName = topicName.trim();

    if (!trimmedName) {
      return;
    }

    onAddTopic(
      trimmedName,
      topicColor
    );

    setTopicName("");
  }

  function handleDeleteProject(
    project: Project
  ) {
    const confirmed = window.confirm(
      `Удалить проект «${project.name}»?\n\nЗадачи сохранятся, но больше не будут относиться к этому проекту.`
    );

    if (confirmed) {
      onDeleteProject(project.id);
    }
  }

  function handleDeleteTopic(
    topic: Topic
  ) {
    const confirmed = window.confirm(
      `Удалить тему «${topic.name}»?\n\nЗадачи сохранятся, но больше не будут относиться к этой теме.`
    );

    if (confirmed) {
      onDeleteTopic(topic.id);
    }
  }

  return (
    <div
      className="
        rounded-3xl
        bg-white/70
        p-5
        shadow-lg
        backdrop-blur-md
      "
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          📁 Проекты и темы
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Группируй задачи по направлению и контексту
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ПРОЕКТЫ */}
        <section>
          <h3 className="mb-3 font-semibold text-gray-700">
            Проекты
          </h3>

          <div className="mb-4 flex gap-2">
            <input
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-pink-200
                bg-white/90
                px-3
                py-2
                text-sm
                outline-none
                transition
                focus:border-pink-300
                focus:ring-2
                focus:ring-pink-100
              "
              placeholder="Новый проект..."
              value={projectName}
              onChange={(event) =>
                setProjectName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddProject();
                }
              }}
            />

            <input
              type="color"
              value={projectColor}
              onChange={(event) =>
                setProjectColor(
                  event.target.value
                )
              }
              className="
                h-10
                w-12
                cursor-pointer
                rounded-xl
                border
                border-gray-200
                bg-white
                p-1
              "
              title="Цвет проекта"
            />

            <button
              type="button"
              onClick={handleAddProject}
              className="
                rounded-xl
                bg-pink-500
                px-4
                font-semibold
                text-white
                transition
                hover:bg-pink-600
                active:scale-95
              "
              title="Добавить проект"
            >
              +
            </button>
          </div>

          <div className="space-y-2">
            {projects.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-gray-200
                  px-3
                  py-5
                  text-center
                  text-sm
                  text-gray-400
                "
              >
                Проектов пока нет
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-gray-100
                    bg-white/80
                    px-3
                    py-2
                  "
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="
                        h-3
                        w-3
                        shrink-0
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          project.color,
                      }}
                    />

                    <span className="truncate text-sm text-gray-700">
                      {project.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteProject(
                        project
                      )
                    }
                    className="
                      shrink-0
                      rounded-lg
                      px-2
                      py-1
                      text-sm
                      text-gray-400
                      transition
                      hover:bg-red-50
                      hover:text-red-500
                    "
                    aria-label={`Удалить проект ${project.name}`}
                    title="Удалить проект"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ТЕМЫ */}
        <section>
          <h3 className="mb-3 font-semibold text-gray-700">
            Темы
          </h3>

          <div className="mb-4 flex gap-2">
            <input
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-violet-200
                bg-white/90
                px-3
                py-2
                text-sm
                outline-none
                transition
                focus:border-violet-300
                focus:ring-2
                focus:ring-violet-100
              "
              placeholder="Новая тема..."
              value={topicName}
              onChange={(event) =>
                setTopicName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddTopic();
                }
              }}
            />

            <input
              type="color"
              value={topicColor}
              onChange={(event) =>
                setTopicColor(
                  event.target.value
                )
              }
              className="
                h-10
                w-12
                cursor-pointer
                rounded-xl
                border
                border-gray-200
                bg-white
                p-1
              "
              title="Цвет темы"
            />

            <button
              type="button"
              onClick={handleAddTopic}
              className="
                rounded-xl
                bg-violet-500
                px-4
                font-semibold
                text-white
                transition
                hover:bg-violet-600
                active:scale-95
              "
              title="Добавить тему"
            >
              +
            </button>
          </div>

          <div className="space-y-2">
            {topics.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-gray-200
                  px-3
                  py-5
                  text-center
                  text-sm
                  text-gray-400
                "
              >
                Тем пока нет
              </div>
            ) : (
              topics.map((topic) => (
                <div
                  key={topic.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-gray-100
                    bg-white/80
                    px-3
                    py-2
                  "
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="
                        h-3
                        w-3
                        shrink-0
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          topic.color,
                      }}
                    />

                    <span className="truncate text-sm text-gray-700">
                      {topic.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteTopic(topic)
                    }
                    className="
                      shrink-0
                      rounded-lg
                      px-2
                      py-1
                      text-sm
                      text-gray-400
                      transition
                      hover:bg-red-50
                      hover:text-red-500
                    "
                    aria-label={`Удалить тему ${topic.name}`}
                    title="Удалить тему"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}