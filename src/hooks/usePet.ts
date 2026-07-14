import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { PetId } from "../types/pet";

const PET_STORAGE_KEY =
  "planner-selected-pet";

const PET_MINIMIZED_STORAGE_KEY =
  "planner-pet-minimized";

const availablePets: PetId[] = [
  "none",
  "cat",
  "dog",
  "owl",
  "dragon",
];

const clickPhrases: Record<
  Exclude<PetId, "none">,
  string[]
> = {
  cat: [
    "Мур! Я рядом 🐾",
    "Не забудь немного отдохнуть",
    "Ты отлично справляешься 🌸",
    "Может, сначала самая маленькая задача?",
    "Я внимательно слежу за прогрессом 👀",
    "Погладь меня ещё раз!",
  ],

  dog: [
    "У тебя всё получится! 🐾",
    "Я верю в тебя!",
    "Ещё одна задача — и можно отдохнуть",
    "Ты сегодня молодец!",
    "Я готов помогать!",
    "Давай сделаем это вместе",
  ],

  owl: [
    "Мудрое решение — всё записать 🦉",
    "Не обязательно делать всё сразу",
    "Маленький шаг тоже считается",
    "Время сосредоточиться",
    "Не забудь сохранить свои мысли",
    "Я наблюдаю за твоим прогрессом",
  ],

  dragon: [
    "Мы покорим этот список! 🐉",
    "Одна задача уже почти побеждена",
    "Твой прогресс впечатляет!",
    "Время зажечь огонь продуктивности 🔥",
    "Даже драконам нужен отдых",
    "Я охраняю твои планы",
  ],
};

const taskAddedPhrases: Record<
  Exclude<PetId, "none">,
  string[]
> = {
  cat: [
    "Записала! Теперь не забудем 🐾",
    "Новая задача поймана!",
    "Мур, план становится понятнее",
  ],

  dog: [
    "Задача принята! Я запомнил 🐾",
    "Отлично, теперь у нас есть план!",
    "Новая задача добавлена!",
  ],

  owl: [
    "Задача записана в мудрый список 🦉",
    "Хорошее планирование",
    "Теперь всё зафиксировано",
  ],

  dragon: [
    "Новая цель добавлена в поход! 🐉",
    "Задача под моей охраной",
    "Ещё одна цель в списке!",
  ],
};

const taskCompletedPhrases: Record<
  Exclude<PetId, "none">,
  string[]
> = {
  cat: [
    "Мур-р-р! Задача выполнена 🌸",
    "Отличная работа! 🐾",
    "Ещё одна задача готова!",
  ],

  dog: [
    "Ура! Ты справилась! 🎉",
    "Вот это результат!",
    "Задача выполнена! Я горжусь тобой",
  ],

  owl: [
    "Прекрасный результат 🦉",
    "Ещё один шаг завершён",
    "Задача выполнена мудро и вовремя",
  ],

  dragon: [
    "Задача повержена! 🔥",
    "Победа! 🐉",
    "Ещё одна цель покорена!",
  ],
};

const allCompletedPhrases: Record<
  Exclude<PetId, "none">,
  string[]
> = {
  cat: [
    "Все задачи дня выполнены! Мур-р-р! 🎉",
    "Можно сворачиваться клубочком — всё готово!",
  ],

  dog: [
    "Все задачи выполнены! Это праздник! 🎉",
    "Ты завершила весь список! Ура!",
  ],

  owl: [
    "Все задачи дня завершены. Великолепно 🦉✨",
    "День закрыт с отличным результатом!",
  ],

  dragon: [
    "Все цели дня покорены! Победа! 🐉🔥",
    "Список побеждён. Дракон доволен!",
  ],
};

function isPetId(
  value: string | null
): value is PetId {
  if (!value) {
    return false;
  }

  return availablePets.includes(
    value as PetId
  );
}

function getInitialPet(): PetId {
  try {
    const savedPet =
      localStorage.getItem(
        PET_STORAGE_KEY
      );

    if (isPetId(savedPet)) {
      return savedPet;
    }
  } catch (error) {
    console.error(
      "Не удалось загрузить питомца:",
      error
    );
  }

  return "cat";
}

function getInitialMinimized(): boolean {
  try {
    return (
      localStorage.getItem(
        PET_MINIMIZED_STORAGE_KEY
      ) === "true"
    );
  } catch (error) {
    console.error(
      "Не удалось загрузить состояние питомца:",
      error
    );

    return false;
  }
}

function getRandomPhrase(
  phrases: string[]
): string {
  const randomIndex = Math.floor(
    Math.random() * phrases.length
  );

  return phrases[randomIndex];
}

function getPetGreeting(
  petId: Exclude<PetId, "none">
): string {
  switch (petId) {
    case "cat":
      return "Мур! Теперь я буду помогать тебе 🐱";

    case "dog":
      return "Привет! Будем выполнять задачи вместе 🐶";

    case "owl":
      return "Я буду мудро следить за твоими планами 🦉";

    case "dragon":
      return "Я буду охранять твой список задач 🐉";
  }
}

export default function usePet() {
  const [
    selectedPet,
    setSelectedPet,
  ] = useState<PetId>(
    getInitialPet
  );

  const [
    isMinimized,
    setIsMinimized,
  ] = useState(
    getInitialMinimized
  );

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null
  );

  const [
    isAnimating,
    setIsAnimating,
  ] = useState(false);

  const messageTimerRef =
    useRef<number | null>(null);

  const animationTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        PET_STORAGE_KEY,
        selectedPet
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить питомца:",
        error
      );
    }
  }, [selectedPet]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PET_MINIMIZED_STORAGE_KEY,
        String(isMinimized)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить состояние питомца:",
        error
      );
    }
  }, [isMinimized]);

  useEffect(() => {
    return () => {
      if (
        messageTimerRef.current !== null
      ) {
        window.clearTimeout(
          messageTimerRef.current
        );
      }

      if (
        animationTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          animationTimerRef.current
        );
      }
    };
  }, []);

  function startAnimation() {
    if (
      animationTimerRef.current !== null
    ) {
      window.clearTimeout(
        animationTimerRef.current
      );
    }

    setIsAnimating(false);

    window.requestAnimationFrame(() => {
      setIsAnimating(true);

      animationTimerRef.current =
        window.setTimeout(() => {
          setIsAnimating(false);
        }, 800);
    });
  }

  function showMessage(
    text: string
  ) {
    if (
      messageTimerRef.current !== null
    ) {
      window.clearTimeout(
        messageTimerRef.current
      );
    }

    setMessage(text);
    startAnimation();

    messageTimerRef.current =
      window.setTimeout(() => {
        setMessage(null);
      }, 4500);
  }

  function selectPet(
    petId: PetId
  ) {
    setSelectedPet(petId);
    setIsMinimized(false);

    if (petId === "none") {
      setMessage(null);
      return;
    }

    showMessage(
      getPetGreeting(petId)
    );
  }

  function interactWithPet() {
    if (selectedPet === "none") {
      return;
    }

    showMessage(
      getRandomPhrase(
        clickPhrases[selectedPet]
      )
    );
  }

  function reactToTaskAdded() {
    if (selectedPet === "none") {
      return;
    }

    showMessage(
      getRandomPhrase(
        taskAddedPhrases[selectedPet]
      )
    );
  }

  function reactToTaskCompleted(
    allTasksCompleted: boolean
  ) {
    if (selectedPet === "none") {
      return;
    }

    const phrases =
      allTasksCompleted
        ? allCompletedPhrases[
            selectedPet
          ]
        : taskCompletedPhrases[
            selectedPet
          ];

    showMessage(
      getRandomPhrase(phrases)
    );
  }

  function toggleMinimized() {
    setIsMinimized(
      (currentValue) =>
        !currentValue
    );

    setMessage(null);
  }

  return {
    selectedPet,
    isMinimized,
    message,
    isAnimating,
    selectPet,
    interactWithPet,
    reactToTaskAdded,
    reactToTaskCompleted,
    toggleMinimized,
  };
}