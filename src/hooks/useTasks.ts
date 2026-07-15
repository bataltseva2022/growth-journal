import {
  useEffect,
  useState,
} from "react";

import type {
  Task,
  TaskTimeField,
} from "../types/task";

const TASKS_STORAGE_KEY = "tasks";

function loadTasks(): Task[] {
  try {
    const savedTasks =
      localStorage.getItem(
        TASKS_STORAGE_KEY
      );

    if (!savedTasks) {
      return [];
    }

    const parsedTasks: unknown =
      JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.map((task) => {
      const savedTask =
        task as Partial<Task>;

      return {
        id:
          typeof savedTask.id === "number"
            ? savedTask.id
            : Date.now(),

        text:
          typeof savedTask.text === "string"
            ? savedTask.text
            : "",

        done:
          savedTask.done ?? false,

        expanded:
          savedTask.expanded ?? false,

        date:
          typeof savedTask.date === "string"
            ? savedTask.date
            : "",

        subtasks: Array.isArray(
          savedTask.subtasks
        )
          ? savedTask.subtasks
          : [],

        projectId:
          typeof savedTask.projectId ===
          "number"
            ? savedTask.projectId
            : null,

        topicId:
          typeof savedTask.topicId ===
          "number"
            ? savedTask.topicId
            : null,

        startedAt:
          typeof savedTask.startedAt ===
          "string"
            ? savedTask.startedAt
            : null,

        finishedAt:
          typeof savedTask.finishedAt ===
          "string"
            ? savedTask.finishedAt
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

function normalizeTimeValue(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  const isValidTime =
    /^([01]\d|2[0-3]):[0-5]\d$/.test(
      value
    );

  return isValidTime
    ? value
    : null;
}

export default function useTasks() {
  const [tasks, setTasks] =
    useState<Task[]>(loadTasks);

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
    const trimmedText =
      text.trim();

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
      startedAt: null,
      finishedAt: null,
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  }

  function editTask(
    taskId: number,
    newText: string
  ) {
    const trimmedText =
      newText.trim();

    if (!trimmedText) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              text: trimmedText,
            }
          : task
      )
    );
  }

  function reorderTasks(
    firstTaskId: number,
    secondTaskId: number
  ) {
    setTasks((currentTasks) => {
      const firstTaskIndex =
        currentTasks.findIndex(
          (task) =>
            task.id === firstTaskId
        );

      const secondTaskIndex =
        currentTasks.findIndex(
          (task) =>
            task.id === secondTaskId
        );

      if (
        firstTaskIndex === -1 ||
        secondTaskIndex === -1
      ) {
        return currentTasks;
      }

      const reorderedTasks = [
        ...currentTasks,
      ];

      const firstTask =
        reorderedTasks[
          firstTaskIndex
        ];

      reorderedTasks[
        firstTaskIndex
      ] =
        reorderedTasks[
          secondTaskIndex
        ];

      reorderedTasks[
        secondTaskIndex
      ] = firstTask;

      return reorderedTasks;
    });
  }

  function updateTaskTime(
    taskId: number,
    field: TaskTimeField,
    value: string | null
  ) {
    const normalizedValue =
      normalizeTimeValue(value);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]:
                normalizedValue,
            }
          : task
      )
    );
  }

  function clearTaskTime(
    taskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              startedAt: null,
              finishedAt: null,
            }
          : task
      )
    );
  }

  function toggleTask(
    taskId: number
  ) {
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

  function deleteTask(
    taskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) =>
          task.id !== taskId
      )
    );
  }

  function toggleExpand(
    taskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              expanded:
                !task.expanded,
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
        task.projectId ===
        projectId
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
    const trimmedText =
      text.trim();

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

  function editSubtask(
    taskId: number,
    subtaskId: number,
    newText: string
  ) {
    const trimmedText =
      newText.trim();

    if (!trimmedText) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks:
                task.subtasks.map(
                  (subtask) =>
                    subtask.id ===
                    subtaskId
                      ? {
                          ...subtask,
                          text:
                            trimmedText,
                        }
                      : subtask
                ),
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
              subtasks:
                task.subtasks.map(
                  (subtask) =>
                    subtask.id ===
                    subtaskId
                      ? {
                          ...subtask,
                          done:
                            !subtask.done,
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
              subtasks:
                task.subtasks.filter(
                  (subtask) =>
                    subtask.id !==
                    subtaskId
                ),
            }
          : task
      )
    );
  }

  function getTasksByDate(
    date: string
  ) {
    return tasks.filter(
      (task) =>
        task.date === date
    );
  }

  function getTasksByProject(
    projectId: number
  ) {
    return tasks.filter(
      (task) =>
        task.projectId ===
        projectId
    );
  }

  function getTasksByTopic(
    topicId: number
  ) {
    return tasks.filter(
      (task) =>
        task.topicId === topicId
    );
  }

  return {
    tasks,
    addTask,
    editTask,
    reorderTasks,
    updateTaskTime,
    clearTaskTime,
    toggleTask,
    deleteTask,
    toggleExpand,
    moveTask,
    setTaskProject,
    setTaskTopic,
    clearProjectFromTasks,
    clearTopicFromTasks,
    addSubtask,
    editSubtask,
    toggleSubtask,
    deleteSubtask,
    getTasksByDate,
    getTasksByProject,
    getTasksByTopic,
  };
}