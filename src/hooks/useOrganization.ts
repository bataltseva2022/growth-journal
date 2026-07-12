import { useEffect, useState } from "react";
import type {
  Project,
  Topic,
} from "../types/organization";

const PROJECTS_STORAGE_KEY = "projects";
const TOPICS_STORAGE_KEY = "topics";

function loadProjects(): Project[] {
  try {
    const savedProjects = localStorage.getItem(
      PROJECTS_STORAGE_KEY
    );

    if (!savedProjects) {
      return [];
    }

    const parsedProjects: unknown =
      JSON.parse(savedProjects);

    if (!Array.isArray(parsedProjects)) {
      return [];
    }

    return parsedProjects
      .filter(
        (project) =>
          typeof project === "object" &&
          project !== null &&
          "id" in project &&
          "name" in project
      )
      .map((project) => {
        const savedProject =
          project as Partial<Project>;

        return {
          id:
            typeof savedProject.id === "number"
              ? savedProject.id
              : Date.now(),

          name:
            typeof savedProject.name === "string"
              ? savedProject.name
              : "Без названия",

          color:
            typeof savedProject.color === "string"
              ? savedProject.color
              : "#f9a8d4",

          createdAt:
            typeof savedProject.createdAt ===
            "number"
              ? savedProject.createdAt
              : Date.now(),
        };
      });
  } catch (error) {
    console.error(
      "Не удалось загрузить проекты:",
      error
    );

    return [];
  }
}

function loadTopics(): Topic[] {
  try {
    const savedTopics = localStorage.getItem(
      TOPICS_STORAGE_KEY
    );

    if (!savedTopics) {
      return [];
    }

    const parsedTopics: unknown =
      JSON.parse(savedTopics);

    if (!Array.isArray(parsedTopics)) {
      return [];
    }

    return parsedTopics
      .filter(
        (topic) =>
          typeof topic === "object" &&
          topic !== null &&
          "id" in topic &&
          "name" in topic
      )
      .map((topic) => {
        const savedTopic =
          topic as Partial<Topic>;

        return {
          id:
            typeof savedTopic.id === "number"
              ? savedTopic.id
              : Date.now(),

          name:
            typeof savedTopic.name === "string"
              ? savedTopic.name
              : "Без названия",

          color:
            typeof savedTopic.color === "string"
              ? savedTopic.color
              : "#c4b5fd",

          createdAt:
            typeof savedTopic.createdAt ===
            "number"
              ? savedTopic.createdAt
              : Date.now(),
        };
      });
  } catch (error) {
    console.error(
      "Не удалось загрузить темы:",
      error
    );

    return [];
  }
}

export default function useOrganization() {
  const [projects, setProjects] =
    useState<Project[]>(loadProjects);

  const [topics, setTopics] =
    useState<Topic[]>(loadTopics);

  useEffect(() => {
    try {
      localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(projects)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить проекты:",
        error
      );
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TOPICS_STORAGE_KEY,
        JSON.stringify(topics)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить темы:",
        error
      );
    }
  }, [topics]);

  function addProject(
    name: string,
    color = "#f9a8d4"
  ) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: trimmedName,
      color,
      createdAt: Date.now(),
    };

    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ]);
  }

  function updateProject(
    projectId: number,
    name: string,
    color: string
  ) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              name: trimmedName,
              color,
            }
          : project
      )
    );
  }

  function deleteProject(projectId: number) {
    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== projectId
      )
    );
  }

  function addTopic(
    name: string,
    color = "#c4b5fd"
  ) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newTopic: Topic = {
      id: Date.now(),
      name: trimmedName,
      color,
      createdAt: Date.now(),
    };

    setTopics((currentTopics) => [
      ...currentTopics,
      newTopic,
    ]);
  }

  function updateTopic(
    topicId: number,
    name: string,
    color: string
  ) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              name: trimmedName,
              color,
            }
          : topic
      )
    );
  }

  function deleteTopic(topicId: number) {
    setTopics((currentTopics) =>
      currentTopics.filter(
        (topic) => topic.id !== topicId
      )
    );
  }

  function getProjectById(
    projectId: number | null
  ) {
    if (projectId === null) {
      return undefined;
    }

    return projects.find(
      (project) => project.id === projectId
    );
  }

  function getTopicById(
    topicId: number | null
  ) {
    if (topicId === null) {
      return undefined;
    }

    return topics.find(
      (topic) => topic.id === topicId
    );
  }

  return {
    projects,
    topics,
    addProject,
    updateProject,
    deleteProject,
    addTopic,
    updateTopic,
    deleteTopic,
    getProjectById,
    getTopicById,
  };
}