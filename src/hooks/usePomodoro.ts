import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PomodoroMode =
  | "focus"
  | "break";

type PomodoroState = {
  mode: PomodoroMode;
  secondsLeft: number;
  isRunning: boolean;
  endAt: number | null;
  completedSessions: number;
  sessionsDate: string;
};

const STORAGE_KEY =
  "growth-journal-pomodoro";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function getDuration(
  mode: PomodoroMode
): number {
  return mode === "focus"
    ? FOCUS_SECONDS
    : BREAK_SECONDS;
}

function getDateKey(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDefaultState(): PomodoroState {
  return {
    mode: "focus",
    secondsLeft: FOCUS_SECONDS,
    isRunning: false,
    endAt: null,
    completedSessions: 0,
    sessionsDate: getDateKey(),
  };
}

function isPomodoroMode(
  value: unknown
): value is PomodoroMode {
  return (
    value === "focus" ||
    value === "break"
  );
}

function getInitialState(): PomodoroState {
  const defaultState =
    createDefaultState();

  try {
    const savedValue =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!savedValue) {
      return defaultState;
    }

    const parsed = JSON.parse(
      savedValue
    ) as Partial<PomodoroState>;

    if (!isPomodoroMode(parsed.mode)) {
      return defaultState;
    }

    const today = getDateKey();

    const completedSessions =
      parsed.sessionsDate === today &&
      typeof parsed.completedSessions ===
        "number"
        ? Math.max(
            0,
            parsed.completedSessions
          )
        : 0;

    const duration = getDuration(
      parsed.mode
    );

    const savedSecondsLeft =
      typeof parsed.secondsLeft ===
        "number"
        ? Math.min(
            duration,
            Math.max(
              0,
              Math.round(
                parsed.secondsLeft
              )
            )
          )
        : duration;

    const isRunning =
      parsed.isRunning === true &&
      typeof parsed.endAt === "number";

    if (!isRunning) {
      return {
        mode: parsed.mode,
        secondsLeft:
          savedSecondsLeft || duration,
        isRunning: false,
        endAt: null,
        completedSessions,
        sessionsDate: today,
      };
    }

    const remainingSeconds =
      Math.ceil(
        (parsed.endAt! -
          Date.now()) /
          1000
      );

    if (remainingSeconds > 0) {
      return {
        mode: parsed.mode,
        secondsLeft:
          remainingSeconds,
        isRunning: true,
        endAt: parsed.endAt!,
        completedSessions,
        sessionsDate: today,
      };
    }

    const nextMode:
      PomodoroMode =
        parsed.mode === "focus"
          ? "break"
          : "focus";

    return {
      mode: nextMode,
      secondsLeft:
        getDuration(nextMode),
      isRunning: false,
      endAt: null,
      completedSessions:
        completedSessions +
        (parsed.mode === "focus"
          ? 1
          : 0),
      sessionsDate: today,
    };
  } catch (error) {
    console.error(
      "Не удалось загрузить помодоро:",
      error
    );

    return defaultState;
  }
}

export default function usePomodoro() {
  const [
    state,
    setState,
  ] = useState<PomodoroState>(
    getInitialState
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить помодоро:",
        error
      );
    }
  }, [state]);

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        setState((currentState) => {
          const today =
            getDateKey();

          const dailyState =
            currentState.sessionsDate ===
            today
              ? currentState
              : {
                  ...currentState,
                  completedSessions: 0,
                  sessionsDate: today,
                };

          if (
            !dailyState.isRunning ||
            dailyState.endAt === null
          ) {
            return dailyState;
          }

          const remainingSeconds =
            Math.ceil(
              (dailyState.endAt -
                Date.now()) /
                1000
            );

          if (remainingSeconds > 0) {
            if (
              remainingSeconds ===
              dailyState.secondsLeft
            ) {
              return dailyState;
            }

            return {
              ...dailyState,
              secondsLeft:
                remainingSeconds,
            };
          }

          const nextMode:
            PomodoroMode =
              dailyState.mode ===
              "focus"
                ? "break"
                : "focus";

          return {
            mode: nextMode,
            secondsLeft:
              getDuration(nextMode),
            isRunning: false,
            endAt: null,
            completedSessions:
              dailyState
                .completedSessions +
              (dailyState.mode ===
              "focus"
                ? 1
                : 0),
            sessionsDate: today,
          };
        });
      }, 250);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, []);

  const start = useCallback(() => {
    setState((currentState) => {
      if (currentState.isRunning) {
        return currentState;
      }

      const duration =
        getDuration(
          currentState.mode
        );

      const secondsLeft =
        currentState.secondsLeft > 0
          ? currentState.secondsLeft
          : duration;

      return {
        ...currentState,
        secondsLeft,
        isRunning: true,
        endAt:
          Date.now() +
          secondsLeft * 1000,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState((currentState) => {
      if (
        !currentState.isRunning ||
        currentState.endAt === null
      ) {
        return currentState;
      }

      const remainingSeconds =
        Math.max(
          0,
          Math.ceil(
            (currentState.endAt -
              Date.now()) /
              1000
          )
        );

      return {
        ...currentState,
        secondsLeft:
          remainingSeconds,
        isRunning: false,
        endAt: null,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      secondsLeft: getDuration(
        currentState.mode
      ),
      isRunning: false,
      endAt: null,
    }));
  }, []);

  const skip = useCallback(() => {
    setState((currentState) => {
      const nextMode:
        PomodoroMode =
          currentState.mode ===
          "focus"
            ? "break"
            : "focus";

      return {
        ...currentState,
        mode: nextMode,
        secondsLeft:
          getDuration(nextMode),
        isRunning: false,
        endAt: null,
      };
    });
  }, []);

  const toggle = useCallback(() => {
    setState((currentState) => {
      if (
        currentState.isRunning &&
        currentState.endAt !== null
      ) {
        const remainingSeconds =
          Math.max(
            0,
            Math.ceil(
              (currentState.endAt -
                Date.now()) /
                1000
            )
          );

        return {
          ...currentState,
          secondsLeft:
            remainingSeconds,
          isRunning: false,
          endAt: null,
        };
      }

      const duration =
        getDuration(
          currentState.mode
        );

      const secondsLeft =
        currentState.secondsLeft > 0
          ? currentState.secondsLeft
          : duration;

      return {
        ...currentState,
        secondsLeft,
        isRunning: true,
        endAt:
          Date.now() +
          secondsLeft * 1000,
      };
    });
  }, []);

  const formattedTime =
    useMemo(() => {
      const minutes = Math.floor(
        state.secondsLeft / 60
      );

      const seconds =
        state.secondsLeft % 60;

      return `${String(
        minutes
      ).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }, [state.secondsLeft]);

  const progress =
    useMemo(() => {
      const duration =
        getDuration(state.mode);

      return Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((duration -
              state.secondsLeft) /
              duration) *
              100
          )
        )
      );
    }, [
      state.mode,
      state.secondsLeft,
    ]);

  return {
    mode: state.mode,
    secondsLeft:
      state.secondsLeft,
    formattedTime,
    isRunning: state.isRunning,
    completedSessions:
      state.completedSessions,
    progress,

    start,
    pause,
    reset,
    skip,
    toggle,
  };
}