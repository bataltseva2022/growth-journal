import { useState } from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Pet from "./components/Pet";

import AppLayout from "./layout/AppLayout";

import useOrganization from "./hooks/useOrganization";
import usePet from "./hooks/usePet";
import usePomodoro from "./hooks/usePomodoro";
import useReflections from "./hooks/useReflections";
import useTasks from "./hooks/useTasks";
import useTheme from "./hooks/useTheme";

import CalendarPage from "./pages/CalendarPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ReflectionPage from "./pages/ReflectionPage";
import SettingsPage from "./pages/SettingsPage";
import TodayPage from "./pages/TodayPage";
import WeekPage from "./pages/WeekPage";

import { getToday } from "./utils/date";

import "./styles/theme.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getToday());

  const [
    taskText,
    setTaskText,
  ] = useState("");

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
    mode: pomodoroMode,
    formattedTime: pomodoroFormattedTime,
    isRunning: isPomodoroRunning,
    completedSessions:
      completedPomodoroSessions,
    progress: pomodoroProgress,
    reset: resetPomodoro,
    skip: skipPomodoro,
    toggle: togglePomodoro,
  } = usePomodoro();


  const {
    selectedPet,
    isMinimized,
    message,
    isAnimating,
    selectPet,
    interactWithPet,
    reactToTaskAdded,
    reactToTaskCompleted,
    toggleMinimized,
  } = usePet();

  const {
    tasks,
    addTask,
    editTask,
    updateTaskNote,
    reorderTasks,
    updateTaskTime,
    clearTaskTime,
    toggleTask,
    deleteTask,
    toggleExpand,
    moveTask,
    clearProjectFromTasks,
    clearTopicFromTasks,
    addSubtask,
    editSubtask,
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

  const todayTasks =
    getTasksByDate(getToday());

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
    reactToTaskAdded();
  }

  function handleToggleTask(
    taskId: number
  ) {
    const taskToToggle =
      tasks.find(
        (task) =>
          task.id === taskId
      );

    if (!taskToToggle) {
      return;
    }

    const willBeCompleted =
      !taskToToggle.done;

    if (willBeCompleted) {
      const tasksForSameDay =
        tasks.filter(
          (task) =>
            task.date ===
            taskToToggle.date
        );

      const allTasksCompleted =
        tasksForSameDay.length > 0 &&
        tasksForSameDay.every(
          (task) =>
            task.id === taskId ||
            task.done
        );

      reactToTaskCompleted(
        allTasksCompleted
      );
    }

    toggleTask(taskId);
  }

  function handleOpenTaskFromWeek(
    date: string
  ) {
    setSelectedDate(date);
    navigate("/today");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteProject(
    projectId: number
  ) {
    clearProjectFromTasks(
      projectId
    );

    deleteProject(projectId);

    if (
      selectedProjectId ===
      projectId
    ) {
      setSelectedProjectId(
        null
      );
    }
  }

  function handleDeleteTopic(
    topicId: number
  ) {
    clearTopicFromTasks(
      topicId
    );

    deleteTopic(topicId);

    if (
      selectedTopicId ===
      topicId
    ) {
      setSelectedTopicId(
        null
      );
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
      <AppLayout
        themeEmoji={currentTheme.emoji}
        themeName={currentTheme.name}
      >
        <div
          key={location.pathname}
          className="
            animate-[fadeIn_0.25s_ease-out]
          "
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  tasks={todayTasks}
                  onToggleTask={
                    handleToggleTask
                  }
                  pomodoroMode={
                    pomodoroMode
                  }
                  pomodoroFormattedTime={
                    pomodoroFormattedTime
                  }
                  isPomodoroRunning={
                    isPomodoroRunning
                  }
                  completedPomodoroSessions={
                    completedPomodoroSessions
                  }
                  pomodoroProgress={
                    pomodoroProgress
                  }
                  onTogglePomodoro={
                    togglePomodoro
                  }
                  onResetPomodoro={
                    resetPomodoro
                  }
                  onSkipPomodoro={
                    skipPomodoro
                  }
                />
              }
            />

            <Route
              path="/today"
              element={
                <TodayPage
                  selectedDate={
                    selectedDate
                  }
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
                  dayTasks={
                    selectedDateTasks
                  }
                  allTasks={tasks}
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
                  onToggle={
                    handleToggleTask
                  }
                  onEditTask={
                    editTask
                  }
                  onUpdateTaskNote={
                    updateTaskNote
                  }
                  onReorderTasks={
                    reorderTasks
                  }
                  onUpdateTaskTime={
                    updateTaskTime
                  }
                  onClearTaskTime={
                    clearTaskTime
                  }
                  onDelete={
                    deleteTask
                  }
                  onToggleExpand={
                    toggleExpand
                  }
                  onToggleSubtask={
                    toggleSubtask
                  }
                  onEditSubtask={
                    editSubtask
                  }
                  onDeleteSubtask={
                    deleteSubtask
                  }
                  onAddSubtask={
                    addSubtask
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
              }
            />

            <Route
              path="/week"
              element={
                <WeekPage
                  tasks={tasks}
                  selectedDate={
                    selectedDate
                  }
                  dayIcon={
                    currentTheme.dayIcon
                  }
                  onMoveTask={
                    moveTask
                  }
                  onReorderTasks={
                    reorderTasks
                  }
                  onOpenTask={
                    handleOpenTaskFromWeek
                  }
                />
              }
            />

            <Route
              path="/calendar"
              element={
                <CalendarPage
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
                  dayIcon={
                    currentTheme.dayIcon
                  }
                  onOpenToday={() =>
                    navigate("/today")
                  }
                />
              }
            />

            <Route
              path="/projects"
              element={
                <ProjectsPage
                  projects={projects}
                  topics={topics}
                  onAddProject={
                    addProject
                  }
                  onDeleteProject={
                    handleDeleteProject
                  }
                  onAddTopic={
                    addTopic
                  }
                  onDeleteTopic={
                    handleDeleteTopic
                  }
                />
              }
            />

            <Route
              path="/reflection"
              element={
                <ReflectionPage
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
                  tasks={tasks}
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
              }
            />

            <Route
              path="/settings"
              element={
                <SettingsPage
                  theme={theme}
                  currentThemeName={
                    currentTheme.name
                  }
                  onThemeChange={
                    setTheme
                  }
                  selectedPet={
                    selectedPet
                  }
                  onSelectPet={
                    selectPet
                  }
                />
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
          </Routes>
        </div>
      </AppLayout>

      <Pet
        petId={selectedPet}
        message={message}
        isAnimating={
          isAnimating
        }
        isMinimized={
          isMinimized
        }
        onInteract={
          interactWithPet
        }
        onToggleMinimized={
          toggleMinimized
        }
      />
    </div>
  );
}