import { useState } from "react";

import BackupPanel from "./components/BackupPanel";
import Calendar from "./components/Calendar";
import OrganizationPanel from "./components/OrganizationPanel";
import PeriodStats from "./components/PeriodStats";
import ReflectionPanel from "./components/ReflectionPanel";
import TaskPanel from "./components/TaskPanel";
import ThemeSwitcher from "./components/ThemeSwitcher";
import WeekBoard from "./components/WeekBoard";

import useOrganization from "./hooks/useOrganization";
import useReflections from "./hooks/useReflections";
import useTasks from "./hooks/useTasks";
import useTheme from "./hooks/useTheme";

import { getToday } from "./utils/date";

import "./styles/theme.css";

export default function App() {
  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [taskText, setTaskText] =
    useState("");

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState<number | null>(null);

  const [
    selectedTopicId,
    setSelectedTopicId,
  ] = useState<number | null>(null);

  const {
    theme,
    setTheme,
    backgroundStyle,
    themeVariables,
    currentTheme,
  } = useTheme();

  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    toggleExpand,
    moveTask,
    clearProjectFromTasks,
    clearTopicFromTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getTasksByDate,
  } = useTasks();

  const {
    projects,
    topics,
    addProject,
    deleteProject,
    addTopic,
    deleteTopic,
  } = useOrganization();

  const {
    getReflectionByDate,
    updateReflectionField,
    setReflectionMood,
    clearReflection,
  } = useReflections();

  const selectedDateTasks =
    getTasksByDate(selectedDate);

  const selectedReflection =
    getReflectionByDate(selectedDate);

  function handleAddTask() {
    const trimmedText =
      taskText.trim();

    if (!trimmedText) {
      return;
    }

    addTask(
      trimmedText,
      selectedDate,
      selectedProjectId,
      selectedTopicId
    );

    setTaskText("");
  }

  function handleDeleteProject(
    projectId: number
  ) {
    clearProjectFromTasks(projectId);
    deleteProject(projectId);

    if (
      selectedProjectId === projectId
    ) {
      setSelectedProjectId(null);
    }
  }

  function handleDeleteTopic(
    topicId: number
  ) {
    clearTopicFromTasks(topicId);
    deleteTopic(topicId);

    if (
      selectedTopicId === topicId
    ) {
      setSelectedTopicId(null);
    }
  }

  return (
    <div
      className="
        planner-theme
        min-h-screen
        p-4
        transition-all
        duration-500
        sm:p-6
      "
      data-theme={theme}
      style={{
        ...backgroundStyle,
        ...themeVariables,
      }}
    >
      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          rounded-3xl
          bg-white/75
          p-4
          shadow-2xl
          backdrop-blur-md
          sm:p-6
        "
      >
        <header
          className="
            mb-6
            flex
            flex-col
            gap-4
            xl:flex-row
            xl:items-start
            xl:justify-between
          "
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {currentTheme.emoji} Мой планировщик
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Планируй задачи, распределяй их по
              проектам и сохраняй мысли о каждом дне
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Тема: {currentTheme.name}
            </p>
          </div>

          <ThemeSwitcher
            theme={theme}
            onThemeChange={setTheme}
          />
        </header>

        {/* Статистика */}
        <PeriodStats
          tasks={tasks}
          selectedDate={selectedDate}
        />

        {/* Слева задачи, справа календарь и организация */}
        <section
          className="
            mb-8
            grid
            grid-cols-1
            items-start
            gap-6
            lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]
          "
        >
          <TaskPanel
            selectedDate={selectedDate}
            dayIcon={currentTheme.dayIcon}
            taskText={taskText}
            onTaskTextChange={setTaskText}
            onAddTask={handleAddTask}
            tasks={selectedDateTasks}
            projects={projects}
            topics={topics}
            selectedProjectId={
              selectedProjectId
            }
            selectedTopicId={
              selectedTopicId
            }
            onProjectChange={
              setSelectedProjectId
            }
            onTopicChange={
              setSelectedTopicId
            }
            onToggle={toggleTask}
            onDelete={deleteTask}
            onToggleExpand={
              toggleExpand
            }
            onToggleSubtask={
              toggleSubtask
            }
            onDeleteSubtask={
              deleteSubtask
            }
            onAddSubtask={
              addSubtask
            }
          />

          <div className="space-y-6">
            <Calendar
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              calendarIcon={
                currentTheme.calendarIcon
              }
              taskMarkerIcon={
                currentTheme.taskMarkerIcon
              }
            />

            <OrganizationPanel
              projects={projects}
              topics={topics}
              onAddProject={addProject}
              onDeleteProject={
                handleDeleteProject
              }
              onAddTopic={addTopic}
              onDeleteTopic={
                handleDeleteTopic
              }
            />
          </div>
        </section>

        {/* Недельная доска */}
        <section
          className="
            mb-8
            overflow-x-auto
            rounded-3xl
            bg-white/65
            p-4
            shadow-lg
            backdrop-blur-sm
            sm:p-6
          "
        >
          <WeekBoard
            tasks={tasks}
            selectedDate={selectedDate}
            dayIcon={currentTheme.dayIcon}
            onMoveTask={moveTask}
          />
        </section>

        {/* Рефлексия */}
        <section className="mb-8">
          <ReflectionPanel
            selectedDate={selectedDate}
            reflection={selectedReflection}
            theme={theme}
            onFieldChange={(
              field,
              value
            ) =>
              updateReflectionField(
                selectedDate,
                field,
                value
              )
            }
            onMoodChange={(mood) =>
              setReflectionMood(
                selectedDate,
                mood
              )
            }
            onClear={() =>
              clearReflection(selectedDate)
            }
          />
        </section>

        {/* Резервные копии */}
        <BackupPanel />
      </main>
    </div>
  );
}