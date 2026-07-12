import {
  useEffect,
  useState,
} from "react";

import type {
  Mood,
  Reflection,
  ReflectionField,
} from "../types/reflection";

type ReflectionsByDate = Record<
  string,
  Reflection
>;

const STORAGE_KEY =
  "planner-reflections";

const allowedMoods: Exclude<
  Mood,
  null
>[] = [
  "awful",
  "bad",
  "neutral",
  "good",
  "great",
];

function createEmptyReflection(
  date: string
): Reflection {
  return {
    date,
    wins: "",
    difficulties: "",
    improvements: "",
    gratitude: "",
    mood: null,
    updatedAt: Date.now(),
  };
}

function isMood(
  value: unknown
): value is Mood {
  return (
    value === null ||
    allowedMoods.includes(
      value as Exclude<Mood, null>
    )
  );
}

function normalizeUpdatedAt(
  value: unknown
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  /*
   * Поддержка старых сохранённых данных,
   * где updatedAt мог быть строкой ISO.
   */
  if (typeof value === "string") {
    const timestamp = Date.parse(value);

    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return Date.now();
}

function normalizeReflection(
  date: string,
  value: unknown
): Reflection {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return createEmptyReflection(date);
  }

  const reflection =
    value as Partial<Reflection>;

  return {
    date:
      typeof reflection.date === "string"
        ? reflection.date
        : date,

    wins:
      typeof reflection.wins === "string"
        ? reflection.wins
        : "",

    difficulties:
      typeof reflection.difficulties ===
      "string"
        ? reflection.difficulties
        : "",

    improvements:
      typeof reflection.improvements ===
      "string"
        ? reflection.improvements
        : "",

    gratitude:
      typeof reflection.gratitude ===
      "string"
        ? reflection.gratitude
        : "",

    mood: isMood(reflection.mood)
      ? reflection.mood
      : null,

    updatedAt: normalizeUpdatedAt(
      reflection.updatedAt
    ),
  };
}

function loadReflections():
  ReflectionsByDate {
  try {
    const savedData =
      localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return {};
    }

    const parsedData: unknown =
      JSON.parse(savedData);

    if (
      !parsedData ||
      typeof parsedData !== "object" ||
      Array.isArray(parsedData)
    ) {
      return {};
    }

    const normalizedData:
      ReflectionsByDate = {};

    Object.entries(parsedData).forEach(
      ([date, reflection]) => {
        normalizedData[date] =
          normalizeReflection(
            date,
            reflection
          );
      }
    );

    return normalizedData;
  } catch (error) {
    console.error(
      "Не удалось загрузить рефлексии:",
      error
    );

    return {};
  }
}

export default function useReflections() {
  const [
    reflections,
    setReflections,
  ] = useState<ReflectionsByDate>(
    loadReflections
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reflections)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить рефлексии:",
        error
      );
    }
  }, [reflections]);

  function getReflectionByDate(
    date: string
  ): Reflection {
    return (
      reflections[date] ??
      createEmptyReflection(date)
    );
  }

  function updateReflectionField(
    date: string,
    field: ReflectionField,
    value: string
  ) {
    setReflections(
      (currentReflections) => {
        const currentReflection =
          currentReflections[date] ??
          createEmptyReflection(date);

        const updatedReflection: Reflection = {
          ...currentReflection,
          date,
          [field]: value,
          updatedAt: Date.now(),
        };

        return {
          ...currentReflections,
          [date]: updatedReflection,
        };
      }
    );
  }

  function setReflectionMood(
    date: string,
    mood: Mood
  ) {
    setReflections(
      (currentReflections) => {
        const currentReflection =
          currentReflections[date] ??
          createEmptyReflection(date);

        const updatedReflection: Reflection = {
          ...currentReflection,
          date,
          mood,
          updatedAt: Date.now(),
        };

        return {
          ...currentReflections,
          [date]: updatedReflection,
        };
      }
    );
  }

  function clearReflection(
    date: string
  ) {
    setReflections(
      (currentReflections) => {
        const updatedReflections = {
          ...currentReflections,
        };

        delete updatedReflections[date];

        return updatedReflections;
      }
    );
  }

  return {
    reflections,
    getReflectionByDate,
    updateReflectionField,
    setReflectionMood,
    clearReflection,
  };
}