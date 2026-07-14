import {
  useEffect,
  useState,
} from "react";

import AppNavigation, {
  type AppTab,
} from "./components/AppNavigation";

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

const ACTIVE_TAB_STORAGE_KEY =
  "planner-active-tab";

const availableTabs: AppTab[] = [
  "today",
  "week",
  "calendar",
  "projects",
  "reflection",
  "settings",
];

function isAppTab(
  value: string | null
): value is AppTab {
  if (!value) {
    return false;
  }

  return availableTabs.includes(
    value as AppTab
  );
}

function getInitialTab(): AppTab {
  try {
    const savedTab =
      localStorage.getItem(
        ACTIVE_TAB_STORAGE_KEY
      );

    if (isAppTab(savedTab)) {
      return savedTab;
    }
  } catch (error) {
    console.error(
      "Не удалось загрузить выбранную вкладку:",
      error
    );
  }

  return "today";
}

export default function App() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<AppTab>(getInitialTab);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getToday());

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
    editTask,
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

  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVE_TAB_STORAGE_KEY,
        activeTab
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить выбранную вкладку:",
        error
      );
    }
  }, [activeTab]);

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

  function renderTodayTab() {
    return (
      <>
        <PeriodStats
          tasks={tasks}
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
            selectedDate={selectedDate}
            dayIcon={
              currentTheme.dayIcon
            }
            taskText={taskText}
            onTaskTextChange={
              setTaskText
            }
            onAddTask={
              handleAddTask
            }
            tasks={
              selectedDateTasks
            }
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
            onEditTask={editTask}
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

          <Calendar
            tasks={tasks}
            selectedDate={
              selectedDate
            }
            onSelectDate={
              setSelectedDate
            }
            calendarIcon={
              currentTheme.calendarIcon
            }
            taskMarkerIcon={
              currentTheme.taskMarkerIcon
            }
          />
        </section>
      </>
    );
  }

  function renderWeekTab() {
    return (
      <section
        className="
          overflow-x-auto
          rounded-3xl
          bg-white/65
          p-4
          shadow-lg
          backdrop-blur-sm
          sm:p-6
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            📋 План на неделю
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Перетаскивай задачи между
            днями и следи за прогрессом
            недели
          </p>
        </div>

        <WeekBoard
          tasks={tasks}
          selectedDate={
            selectedDate
          }
          dayIcon={
            currentTheme.dayIcon
          }
          onMoveTask={moveTask}
        />
      </section>
    );
  }

  function renderCalendarTab() {
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
            {currentTheme.calendarIcon}{" "}
            Календарь
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
            selectedDate={
              selectedDate
            }
            onSelectDate={
              setSelectedDate
            }
            calendarIcon={
              currentTheme.calendarIcon
            }
            taskMarkerIcon={
              currentTheme.taskMarkerIcon
            }
          />

          <div className="space-y-6">
            <PeriodStats
              tasks={tasks}
              selectedDate={
                selectedDate
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
                  text-lg
                  font-bold
                  text-gray-800
                "
              >
                {currentTheme.dayIcon}{" "}
                Выбранный день
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                "
              >
                После выбора даты перейди
                во вкладку «Сегодня»,
                чтобы добавить или
                отредактировать задачи
                этого дня.
              </p>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("today")
                }
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

  function renderProjectsTab() {
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
            📁 Проекты и темы
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Создавай категории, чтобы
            разделять рабочие, личные и
            другие задачи
          </p>
        </div>

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
      </section>
    );
  }

  function renderReflectionTab() {
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
            selectedDate={
              selectedDate
            }
            reflection={
              selectedReflection
            }
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
              clearReflection(
                selectedDate
              )
            }
          />

          <div className="space-y-6">
            <Calendar
              tasks={tasks}
              selectedDate={
                selectedDate
              }
              onSelectDate={
                setSelectedDate
              }
              calendarIcon={
                currentTheme.calendarIcon
              }
              taskMarkerIcon={
                currentTheme.taskMarkerIcon
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

  function renderSettingsTab() {
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
            ⚙️ Настройки
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Выбирай оформление и сохраняй
            резервные копии данных
          </p>
        </div>

        <section
          className="
            rounded-3xl
            border
            border-white/60
            bg-white/65
            p-5
            shadow-lg
            backdrop-blur-md
          "
        >
          <div className="mb-4">
            <h3
              className="
                text-lg
                font-bold
                text-gray-800
              "
            >
              🎨 Оформление
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Текущая тема:{" "}
              {currentTheme.name}
            </p>
          </div>

          <ThemeSwitcher
            theme={theme}
            onThemeChange={
              setTheme
            }
          />
        </section>

        <BackupPanel />
      </section>
    );
  }

  function renderActiveTab() {
    switch (activeTab) {
      case "today":
        return renderTodayTab();

      case "week":
        return renderWeekTab();

      case "calendar":
        return renderCalendarTab();

      case "projects":
        return renderProjectsTab();

      case "reflection":
        return renderReflectionTab();

      case "settings":
        return renderSettingsTab();

      default:
        return renderTodayTab();
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
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-gray-800
              "
            >
              {currentTheme.emoji} Мой
              планировщик
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                text-gray-500
              "
            >
              Планируй задачи, наблюдай за
              прогрессом и сохраняй мысли
              о каждом дне
            </p>
          </div>

          <div
            className="
              self-start
              rounded-2xl
              bg-white/60
              px-4
              py-2
              text-sm
              font-medium
              text-gray-500
              shadow-sm
            "
          >
            {currentTheme.emoji}{" "}
            {currentTheme.name}
          </div>
        </header>

        <AppNavigation
          activeTab={activeTab}
          onTabChange={
            setActiveTab
          }
        />

        <div
          key={activeTab}
          className="
            animate-[fadeIn_0.25s_ease-out]
          "
        >
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}