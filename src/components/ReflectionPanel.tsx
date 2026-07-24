import type { ThemeId } from "../hooks/useTheme";

import type {
  Mood,
  Reflection,
  ReflectionField,
} from "../types/reflection";

import { parseDate } from "../utils/date";

type Props = {
  selectedDate: string;
  reflection: Reflection;
  theme: ThemeId;

  onFieldChange: (
    field: ReflectionField,
    value: string
  ) => void;

  onMoodChange: (mood: Mood) => void;
  onClear: () => void;
};

type MoodOption = {
  value: Exclude<Mood, null>;
  emoji: string;
  label: string;
};

type ReflectionIcons = {
  header: string;
  wins: string;
  difficulties: string;
  improvements: string;
  gratitude: string;
};

const moodOptions: MoodOption[] = [
  {
    value: "awful",
    emoji: "😞",
    label: "Очень тяжело",
  },
  {
    value: "bad",
    emoji: "😕",
    label: "Не очень",
  },
  {
    value: "neutral",
    emoji: "😐",
    label: "Нормально",
  },
  {
    value: "good",
    emoji: "😊",
    label: "Хорошо",
  },
  {
    value: "great",
    emoji: "🤩",
    label: "Прекрасно",
  },
];

const reflectionIcons: Record<
  ThemeId,
  ReflectionIcons
> = {
  sakura: {
    header: "🌸",
    wins: "🌸",
    difficulties: "🌧️",
    improvements: "🌱",
    gratitude: "💗",
  },

  lavender: {
    header: "🪻",
    wins: "💜",
    difficulties: "🌫️",
    improvements: "🪻",
    gratitude: "💟",
  },

  forest: {
    header: "🍀",
    wins: "🌿",
    difficulties: "🌧️",
    improvements: "🌱",
    gratitude: "🍃",
  },

  sky: {
    header: "☁️",
    wins: "🌤️",
    difficulties: "🌧️",
    improvements: "🌈",
    gratitude: "⭐",
  },

  sunset: {
    header: "☀️🌙",
    wins: "☀️",
    difficulties: "🌙",
    improvements: "🌅",
    gratitude: "✨",
  },

  minimal: {
    header: "📝✏️",
    wins: "✅",
    difficulties: "⚠️",
    improvements: "✏️",
    gratitude: "🤍",
  },

  fantasy: {
    header: "🦉",
    wins: "✨",
    difficulties: "🌫️",
    improvements: "🧪",
    gratitude: "🔮",
  },
};

export default function ReflectionPanel({
  selectedDate,
  reflection,
  theme,
  onFieldChange,
  onMoodChange,
  onClear,
}: Props) {
  const date = parseDate(selectedDate);

  const icons =
    reflectionIcons[theme];

  const formattedDate =
    date.toLocaleDateString(
      "ru-RU",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const hasReflection =
    reflection.wins.trim() !== "" ||
    reflection.difficulties.trim() !== "" ||
    reflection.improvements.trim() !== "" ||
    reflection.gratitude.trim() !== "" ||
    reflection.mood !== null;

  function handleClear() {
    const confirmed =
      window.confirm(
        "Очистить рефлексию за выбранный день?"
      );

    if (confirmed) {
      onClear();
    }
  }

  return (
    <div
      className="
        rounded-3xl
        bg-white/70
        p-4
        shadow-lg
        backdrop-blur-md
        sm:p-6
      "
    >
      <div
        className="
          mb-6
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-gray-800
            "
          >
            {icons.header} Рефлексия дня
          </h2>

          <p
            className="
              mt-1
              capitalize
              text-sm
              text-gray-500
            "
          >
            {formattedDate}
          </p>
        </div>

        {hasReflection && (
          <button
            type="button"
            onClick={handleClear}
            className="
              self-start
              rounded-xl
              border
              border-gray-200
              bg-white/70
              px-4
              py-2
              text-sm
              text-gray-500
              transition
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-500
            "
          >
            Очистить
          </button>
        )}
      </div>

      <div className="mb-7">
        <h3
          className="
            mb-3
            font-semibold
            text-gray-700
          "
        >
          Как прошло настроение дня?
        </h3>

        <div className="flex flex-wrap gap-3">
          {moodOptions.map(
            (option) => {
              const isSelected =
                reflection.mood ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onMoodChange(
                      isSelected
                        ? null
                        : option.value
                    )
                  }
                  className={`
                    flex
                    min-w-[82px]
                    flex-col
                    items-center
                    gap-1
                    rounded-2xl
                    border
                    px-3
                    py-3
                    transition
                    ${
                      isSelected
                        ? "border-pink-400 bg-pink-100 shadow-sm"
                        : "border-gray-200 bg-white/70 hover:border-pink-200 hover:bg-pink-50"
                    }
                  `}
                  title={option.label}
                >
                  <span className="text-3xl">
                    {option.emoji}
                  </span>

                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {option.label}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-2
        "
      >
        <ReflectionTextarea
          title={`${icons.wins} Что получилось?`}
          placeholder="Запиши всё, что сегодня получилось хорошо..."
          value={reflection.wins}
          onChange={(value) =>
            onFieldChange(
              "wins",
              value
            )
          }
        />

        <ReflectionTextarea
          title={`${icons.difficulties} Что было сложно?`}
          placeholder="Что вызвало трудности, усталость или сопротивление?"
          value={
            reflection.difficulties
          }
          onChange={(value) =>
            onFieldChange(
              "difficulties",
              value
            )
          }
        />

        <ReflectionTextarea
          title={`${icons.improvements} Что можно улучшить?`}
          placeholder="Что завтра можно сделать немного иначе?"
          value={
            reflection.improvements
          }
          onChange={(value) =>
            onFieldChange(
              "improvements",
              value
            )
          }
        />

        <ReflectionTextarea
          title={`${icons.gratitude} За что я благодарна?`}
          placeholder="Люди, события или маленькие приятные моменты..."
          value={
            reflection.gratitude
          }
          onChange={(value) =>
            onFieldChange(
              "gratitude",
              value
            )
          }
        />
      </div>

      <p
        className="
          mt-5
          text-xs
          text-gray-400
        "
      >
        Изменения сохраняются автоматически
      </p>
    </div>
  );
}

type ReflectionTextareaProps = {
  title: string;
  placeholder: string;
  value: string;
  onChange: (
    value: string
  ) => void;
};

function ReflectionTextarea({
  title,
  placeholder,
  value,
  onChange,
}: ReflectionTextareaProps) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          font-semibold
          text-gray-700
        "
      >
        {title}
      </span>

      <textarea
        className="
          min-h-[140px]
          w-full
          resize-y
          rounded-2xl
          border
          border-pink-100
          bg-white/80
          p-4
          text-sm
          text-gray-700
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-pink-300
          focus:ring-2
          focus:ring-pink-100
        "
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </label>
  );
}