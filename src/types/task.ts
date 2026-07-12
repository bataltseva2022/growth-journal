export type Subtask = {
  id: number;
  text: string;
  done: boolean;
};

export type Task = {
  id: number;
  text: string;
  done: boolean;
  expanded: boolean;
  date: string;
  subtasks: Subtask[];

  // Проект, к которому относится задача
  projectId: number | null;

  // Тема, к которой относится задача
  topicId: number | null;
};