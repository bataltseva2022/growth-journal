import type { ThemeId } from "../hooks/useTheme";
import { themeOptions } from "../hooks/useTheme";

type Props = {
  theme: ThemeId;

  onThemeChange: (
    theme: ThemeId
  ) => void;
};

export default function ThemeSwitcher({
  theme,
  onThemeChange,
}: Props) {
  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-white/70
        bg-white/70
        p-3
        shadow-md
        backdrop-blur-md
        xl:w-auto
      "
    >
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <h2 className="text-sm font-semibold text-gray-700">
          🎨 Оформление
        </h2>

        <span className="text-xs text-gray-400">
          Сохраняется автоматически
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-3
          gap-2
          sm:grid-cols-6
        "
      >
        {themeOptions.map((option) => {
          const isSelected =
            option.id === theme;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onThemeChange(option.id)
              }
              aria-pressed={isSelected}
              title={option.name}
              className={`
                flex
                min-w-[74px]
                flex-col
                items-center
                gap-1
                rounded-xl
                border
                p-2
                text-xs
                transition
                ${
                  isSelected
                    ? "border-pink-400 bg-pink-50 shadow-sm ring-2 ring-pink-100"
                    : "border-gray-200 bg-white/80 hover:border-pink-200 hover:bg-pink-50"
                }
              `}
            >
              <span
                className="
                  h-8
                  w-full
                  rounded-lg
                  border
                  border-white/80
                  shadow-inner
                "
                style={option.previewStyle}
              />

              <span className="whitespace-nowrap text-gray-600">
                {option.emoji} {option.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}