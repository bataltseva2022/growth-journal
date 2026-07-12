export type Mood =
  | "awful"
  | "bad"
  | "neutral"
  | "good"
  | "great"
  | null;

export type ReflectionField =
  | "wins"
  | "difficulties"
  | "improvements"
  | "gratitude";

export type Reflection = {
  date: string;

  // Что получилось за день
  wins: string;

  // Что было сложно
  difficulties: string;

  // Что хотелось бы улучшить
  improvements: string;

  // За что благодарна
  gratitude: string;

  // Настроение дня
  mood: Mood;

  // Время последнего изменения
  updatedAt: number;
};