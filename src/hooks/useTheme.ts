import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";

export type ThemeId =
  | "sakura"
  | "lavender"
  | "forest"
  | "sky"
  | "sunset"
  | "minimal";

export type ThemeOption = {
  id: ThemeId;
  name: string;
  emoji: string;
  previewStyle: CSSProperties;
  dayIcon: string;
  calendarIcon: string;
  taskMarkerIcon: string;
};

type ThemeCSSVariables = CSSProperties & {
  [key: `--${string}`]: string | number;
};

type ThemeConfig = ThemeOption & {
  backgroundStyle: CSSProperties;
  variables: ThemeCSSVariables;
};

type UseThemeResult = {
  theme: ThemeId;
  setTheme: Dispatch<SetStateAction<ThemeId>>;
  backgroundStyle: CSSProperties;
  themeVariables: ThemeCSSVariables;
  currentTheme: ThemeOption;
};

const THEME_STORAGE_KEY =
  "planner-background-theme";

const DEFAULT_THEME: ThemeId = "sakura";

const allowedThemeIds: ThemeId[] = [
  "sakura",
  "lavender",
  "forest",
  "sky",
  "sunset",
  "minimal",
];

const commonSuccessVariables = {
  "--success": "#16a34a",
  "--success-soft": "#f0fdf4",
  "--success-border": "#bbf7d0",
};

const themeConfigs: ThemeConfig[] = [
  {
    id: "sakura",
    name: "Сакура",
    emoji: "🌸",
    dayIcon: "🌸",
    calendarIcon: "🌸",
    taskMarkerIcon: "🌸",

    previewStyle: {
      backgroundColor: "#fff1f5",
      backgroundImage:
        "url('/flowers_pattern.svg')",
      backgroundSize: "55px 55px",
    },

    backgroundStyle: {
      backgroundColor: "#fff1f5",
      backgroundImage:
        "url('/flowers_pattern.svg')",
      backgroundRepeat: "repeat",
      backgroundSize: "160px 160px",
      backgroundAttachment: "fixed",
    },

    variables: {
      "--accent": "#ec4899",
      "--accent-hover": "#db2777",
      "--accent-light": "#f472b6",
      "--accent-soft": "#fdf2f8",
      "--accent-soft-strong": "#fce7f3",
      "--accent-border": "#f9a8d4",
      "--accent-ring":
        "rgba(236, 72, 153, 0.22)",

      "--secondary": "#8b5cf6",
      "--secondary-hover": "#7c3aed",
      "--secondary-light": "#a78bfa",
      "--secondary-soft": "#f5f3ff",
      "--secondary-soft-strong": "#ede9fe",
      "--secondary-border": "#c4b5fd",
      "--secondary-ring":
        "rgba(139, 92, 246, 0.20)",

      "--surface-main":
        "rgba(255, 250, 252, 0.84)",
      "--surface-card":
        "rgba(255, 255, 255, 0.80)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.94)",
      "--surface-muted":
        "rgba(255, 255, 255, 0.66)",
      "--surface-border":
        "rgba(249, 168, 212, 0.48)",

      "--text-primary": "#3f3f46",
      "--text-muted": "#71717a",

      ...commonSuccessVariables,
    },
  },

  {
    id: "lavender",
    name: "Лаванда",
    emoji: "💜",
    dayIcon: "🪻",
    calendarIcon: "🪻",
    taskMarkerIcon: "🪻",

    previewStyle: {
      background:
        "linear-gradient(135deg, #ddd6fe 0%, #f5f3ff 52%, #fae8ff 100%)",
    },

    backgroundStyle: {
      backgroundColor: "#f5f3ff",
      backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(196, 181, 253, 0.65) 0, transparent 26%), radial-gradient(circle at 85% 15%, rgba(240, 171, 252, 0.45) 0, transparent 28%), linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #fae8ff 100%)",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },

    variables: {
      "--accent": "#8b5cf6",
      "--accent-hover": "#7c3aed",
      "--accent-light": "#a78bfa",
      "--accent-soft": "#f5f3ff",
      "--accent-soft-strong": "#ede9fe",
      "--accent-border": "#c4b5fd",
      "--accent-ring":
        "rgba(139, 92, 246, 0.22)",

      "--secondary": "#d946ef",
      "--secondary-hover": "#c026d3",
      "--secondary-light": "#e879f9",
      "--secondary-soft": "#fdf4ff",
      "--secondary-soft-strong": "#fae8ff",
      "--secondary-border": "#f0abfc",
      "--secondary-ring":
        "rgba(217, 70, 239, 0.20)",

      "--surface-main":
        "rgba(250, 248, 255, 0.86)",
      "--surface-card":
        "rgba(255, 255, 255, 0.79)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.94)",
      "--surface-muted":
        "rgba(255, 255, 255, 0.65)",
      "--surface-border":
        "rgba(196, 181, 253, 0.55)",

      "--text-primary": "#3f3c4d",
      "--text-muted": "#77718a",

      ...commonSuccessVariables,
    },
  },

  {
    id: "forest",
    name: "Лес",
    emoji: "🌿",
    dayIcon: "🍀",
    calendarIcon: "🍀",
    taskMarkerIcon: "🍀",

    previewStyle: {
      background:
        "linear-gradient(135deg, #a7f3d0 0%, #ecfdf5 52%, #d9f99d 100%)",
    },

    backgroundStyle: {
      backgroundColor: "#ecfdf5",
      backgroundImage:
        "radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.35) 0, transparent 25%), radial-gradient(circle at 85% 70%, rgba(163, 230, 53, 0.28) 0, transparent 27%), linear-gradient(135deg, #d1fae5 0%, #ecfdf5 50%, #f0fdf4 100%)",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },

    variables: {
      "--accent": "#059669",
      "--accent-hover": "#047857",
      "--accent-light": "#34d399",
      "--accent-soft": "#ecfdf5",
      "--accent-soft-strong": "#d1fae5",
      "--accent-border": "#6ee7b7",
      "--accent-ring":
        "rgba(5, 150, 105, 0.20)",

      "--secondary": "#65a30d",
      "--secondary-hover": "#4d7c0f",
      "--secondary-light": "#84cc16",
      "--secondary-soft": "#f7fee7",
      "--secondary-soft-strong": "#ecfccb",
      "--secondary-border": "#bef264",
      "--secondary-ring":
        "rgba(101, 163, 13, 0.20)",

      "--surface-main":
        "rgba(248, 255, 251, 0.86)",
      "--surface-card":
        "rgba(255, 255, 255, 0.80)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.94)",
      "--surface-muted":
        "rgba(255, 255, 255, 0.66)",
      "--surface-border":
        "rgba(110, 231, 183, 0.50)",

      "--text-primary": "#34413b",
      "--text-muted": "#68776f",

      ...commonSuccessVariables,
    },
  },

  {
    id: "sky",
    name: "Небо",
    emoji: "☁️",
    dayIcon: "☁️",
    calendarIcon: "☁️",
    taskMarkerIcon: "☁️",

    previewStyle: {
      background:
        "linear-gradient(135deg, #bae6fd 0%, #f0f9ff 52%, #dbeafe 100%)",
    },

    backgroundStyle: {
      backgroundColor: "#f0f9ff",
      backgroundImage:
        "radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.95) 0, transparent 23%), radial-gradient(circle at 80% 28%, rgba(255, 255, 255, 0.78) 0, transparent 20%), linear-gradient(135deg, #bae6fd 0%, #e0f2fe 50%, #f0f9ff 100%)",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },

    variables: {
      "--accent": "#0284c7",
      "--accent-hover": "#0369a1",
      "--accent-light": "#38bdf8",
      "--accent-soft": "#f0f9ff",
      "--accent-soft-strong": "#e0f2fe",
      "--accent-border": "#7dd3fc",
      "--accent-ring":
        "rgba(2, 132, 199, 0.20)",

      "--secondary": "#4f46e5",
      "--secondary-hover": "#4338ca",
      "--secondary-light": "#818cf8",
      "--secondary-soft": "#eef2ff",
      "--secondary-soft-strong": "#e0e7ff",
      "--secondary-border": "#a5b4fc",
      "--secondary-ring":
        "rgba(79, 70, 229, 0.20)",

      "--surface-main":
        "rgba(248, 252, 255, 0.86)",
      "--surface-card":
        "rgba(255, 255, 255, 0.80)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.94)",
      "--surface-muted":
        "rgba(255, 255, 255, 0.66)",
      "--surface-border":
        "rgba(125, 211, 252, 0.52)",

      "--text-primary": "#334155",
      "--text-muted": "#64748b",

      ...commonSuccessVariables,
    },
  },

  {
    id: "sunset",
    name: "Закат",
    emoji: "🌅",
    dayIcon: "☀️🌙",
    calendarIcon: "☀️🌙",
    taskMarkerIcon: "🌙",

    previewStyle: {
      background:
        "linear-gradient(135deg, #fed7aa 0%, #fce7f3 52%, #ddd6fe 100%)",
    },

    backgroundStyle: {
      backgroundColor: "#fff7ed",
      backgroundImage:
        "radial-gradient(circle at 15% 75%, rgba(251, 146, 60, 0.35) 0, transparent 28%), radial-gradient(circle at 85% 20%, rgba(168, 85, 247, 0.30) 0, transparent 25%), linear-gradient(135deg, #fed7aa 0%, #fce7f3 48%, #ddd6fe 100%)",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },

    variables: {
      "--accent": "#f97316",
      "--accent-hover": "#ea580c",
      "--accent-light": "#fb923c",
      "--accent-soft": "#fff7ed",
      "--accent-soft-strong": "#ffedd5",
      "--accent-border": "#fdba74",
      "--accent-ring":
        "rgba(249, 115, 22, 0.22)",

      "--secondary": "#db2777",
      "--secondary-hover": "#be185d",
      "--secondary-light": "#f472b6",
      "--secondary-soft": "#fdf2f8",
      "--secondary-soft-strong": "#fce7f3",
      "--secondary-border": "#f9a8d4",
      "--secondary-ring":
        "rgba(219, 39, 119, 0.20)",

      "--surface-main":
        "rgba(255, 250, 247, 0.86)",
      "--surface-card":
        "rgba(255, 255, 255, 0.80)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.94)",
      "--surface-muted":
        "rgba(255, 255, 255, 0.66)",
      "--surface-border":
        "rgba(253, 186, 116, 0.52)",

      "--text-primary": "#493b35",
      "--text-muted": "#806d65",

      ...commonSuccessVariables,
    },
  },

  {
    id: "minimal",
    name: "Минимализм",
    emoji: "🤍",
    dayIcon: "📝✏️",
    calendarIcon: "📝✏️",
    taskMarkerIcon: "✏️",

    previewStyle: {
      backgroundColor: "#f5f5f4",
      backgroundImage:
        "linear-gradient(#d6d3d1 1px, transparent 1px), linear-gradient(90deg, #d6d3d1 1px, transparent 1px)",
      backgroundSize: "12px 12px",
    },

    backgroundStyle: {
      backgroundColor: "#f5f5f4",
      backgroundImage:
        "linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      backgroundRepeat: "repeat",
      backgroundAttachment: "fixed",
    },

    variables: {
      "--accent": "#57534e",
      "--accent-hover": "#44403c",
      "--accent-light": "#78716c",
      "--accent-soft": "#fafaf9",
      "--accent-soft-strong": "#f5f5f4",
      "--accent-border": "#d6d3d1",
      "--accent-ring":
        "rgba(87, 83, 78, 0.18)",

      "--secondary": "#78716c",
      "--secondary-hover": "#57534e",
      "--secondary-light": "#a8a29e",
      "--secondary-soft": "#fafaf9",
      "--secondary-soft-strong": "#f5f5f4",
      "--secondary-border": "#d6d3d1",
      "--secondary-ring":
        "rgba(120, 113, 108, 0.18)",

      "--surface-main":
        "rgba(255, 255, 255, 0.90)",
      "--surface-card":
        "rgba(255, 255, 255, 0.86)",
      "--surface-strong":
        "rgba(255, 255, 255, 0.96)",
      "--surface-muted":
        "rgba(250, 250, 249, 0.78)",
      "--surface-border":
        "rgba(168, 162, 158, 0.42)",

      "--text-primary": "#292524",
      "--text-muted": "#78716c",

      ...commonSuccessVariables,
    },
  },
];

export const themeOptions: ThemeOption[] =
  themeConfigs.map(
    ({
      id,
      name,
      emoji,
      previewStyle,
      dayIcon,
      calendarIcon,
      taskMarkerIcon,
    }) => ({
      id,
      name,
      emoji,
      previewStyle,
      dayIcon,
      calendarIcon,
      taskMarkerIcon,
    })
  );

function isThemeId(
  value: string | null
): value is ThemeId {
  if (!value) {
    return false;
  }

  return allowedThemeIds.includes(
    value as ThemeId
  );
}

function loadTheme(): ThemeId {
  try {
    const savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY
    );

    return isThemeId(savedTheme)
      ? savedTheme
      : DEFAULT_THEME;
  } catch (error) {
    console.error(
      "Не удалось загрузить выбранную тему:",
      error
    );

    return DEFAULT_THEME;
  }
}

function getThemeConfig(
  themeId: ThemeId
): ThemeConfig {
  return (
    themeConfigs.find(
      (theme) => theme.id === themeId
    ) ?? themeConfigs[0]
  );
}

export default function useTheme(): UseThemeResult {
  const [theme, setTheme] =
    useState<ThemeId>(loadTheme);

  useEffect(() => {
    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
      );
    } catch (error) {
      console.error(
        "Не удалось сохранить выбранную тему:",
        error
      );
    }
  }, [theme]);

  const config = useMemo(
    () => getThemeConfig(theme),
    [theme]
  );

  const currentTheme: ThemeOption = {
    id: config.id,
    name: config.name,
    emoji: config.emoji,
    previewStyle: config.previewStyle,
    dayIcon: config.dayIcon,
    calendarIcon: config.calendarIcon,
    taskMarkerIcon: config.taskMarkerIcon,
  };

  return {
    theme,
    setTheme,
    backgroundStyle: config.backgroundStyle,
    themeVariables: config.variables,
    currentTheme,
  };
}