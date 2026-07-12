import { useEffect, useState } from "react";
import type { Task } from "../types/task";

const TASKS_STORAGE_KEY = "tasks";

function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks: unknown = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.map((task) => {
      const savedTask = task as Partial<Task>;

      return {
        id:
          typeof savedTask.id === "number"
            ? savedTask.id
            : Date.now(),

        text:
          typeof savedTask.text === "string"
            ? savedTask.text
            : "",

        done: savedTask.done ?? false,

        expanded: savedTask.expanded ?? false,

        date:
          typeof savedTask.date === "string"
            ? savedTask.date
            : "",

        subtasks: Array.isArray(savedTask.subtasks)
          ? savedTask.subtasks
          : [],

        projectId:
          typeof savedTask.projectId === "number"
            ? savedTask.projectId
            : null,

        topicId:
          typeof savedTask.topicId === "number"
            ? savedTask.topicId
            : null,
      };
    });
  } catch (error) {
    console.error(
      "Не удалось загрузить задачи из localStorage:",
      error
    );

    return [];
  }
}

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    try {
      localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить задачи:",
        error
      );
    }
  }, [tasks]);

  function addTask(
    text: string,
    date: string,
    projectId: number | null = null,
    topicId: number | null = null
  ) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: trimmedText,
      done: false,
      expanded: false,
      date,
      subtasks: [],
      projectId,
      topicId,
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  }

  function toggleTask(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  }

  function deleteTask(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  function toggleExpand(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              expanded: !task.expanded,
            }
          : task
      )
    );
  }

  function moveTask(
    taskId: number,
    newDate: string
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              date: newDate,
            }
          : task
      )
    );
  }

  function setTaskProject(
    taskId: number,
    projectId: number | null
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              projectId,
            }
          : task
      )
    );
  }

  function setTaskTopic(
    taskId: number,
    topicId: number | null
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              topicId,
            }
          : task
      )
    );
  }

  function clearProjectFromTasks(
    projectId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.projectId === projectId
          ? {
              ...task,
              projectId: null,
            }
          : task
      )
    );
  }

  function clearTopicFromTasks(
    topicId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.topicId === topicId
          ? {
              ...task,
              topicId: null,
            }
          : task
      )
    );
  }

  function addSubtask(
    taskId: number,
    text: string
  ) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    const newSubtask = {
      id: Date.now(),
      text: trimmedText,
      done: false,
    };

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                newSubtask,
              ],
            }
          : task
      )
    );
  }

  function toggleSubtask(
    taskId: number,
    subtaskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(
                (subtask) =>
                  subtask.id === subtaskId
                    ? {
                        ...subtask,
                        done: !subtask.done,
                      }
                    : subtask
              ),
            }
          : task
      )
    );
  }

  function deleteSubtask(
    taskId: number,
    subtaskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) =>
                  subtask.id !== subtaskId
              ),
            }
          : task
      )
    );
  }

  function getTasksByDate(date: string) {
    return tasks.filter(
      (task) => task.date === date
    );
  }

  function getTasksByProject(
    projectId: number
  ) {
    return tasks.filter(
      (task) => task.projectId === projectId
    );
  }

  function getTasksByTopic(topicId: number) {
    return tasks.filter(
      (task) => task.topicId === topicId
    );
  }

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    toggleExpand,
    moveTask,
    setTaskProject,
    setTaskTopic,
    clearProjectFromTasks,
    clearTopicFromTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getTasksByDate,
    getTasksByProject,
    getTasksByTopic,
  };
}