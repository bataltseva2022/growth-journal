export type Subtask = {
  id: number;
  text: string;
  done: boolean;
};

export type TaskTimeField =
  | "startedAt"
  | "finishedAt";

export type Task = {
  id: number;
  text: string;
  done: boolean;
  expanded: boolean;
  date: string;
  subtasks: Subtask[];
  projectId: number | null;
  topicId: number | null;

  startedAt: string | null;
  finishedAt: string | null;
};