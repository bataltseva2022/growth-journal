import type {
  ComponentProps,
} from "react";

import BackupPanel from "../components/BackupPanel";
import PetSelector from "../components/PetSelector";
import ThemeSwitcher from "../components/ThemeSwitcher";

type ThemeSwitcherProps =
  ComponentProps<typeof ThemeSwitcher>;

type PetSelectorProps =
  ComponentProps<typeof PetSelector>;

type Props = {
  theme: ThemeSwitcherProps["theme"];
  currentThemeName: string;
  onThemeChange:
    ThemeSwitcherProps["onThemeChange"];
  selectedPet:
    PetSelectorProps["selectedPet"];
  onSelectPet:
    PetSelectorProps["onSelectPet"];
};

export default function SettingsPage({
  theme,
  currentThemeName,
  onThemeChange,
  selectedPet,
  onSelectPet,
}: Props) {
  return (
    <section className="space-y-6">
      <div
        className="
          rounded-3xl
          bg-white/65
          p-5
          shadow-lg
          backdrop-blur-sm
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          ⚙️ Настройки
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Выбирай оформление, питомца
          и сохраняй резервные копии
          данных
        </p>
      </div>

      <section
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/65
          p-5
          shadow-lg
          backdrop-blur-md
        "
      >
        <div className="mb-4">
          <h3
            className="
              text-lg
              font-bold
              text-gray-800
            "
          >
            🎨 Оформление
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Текущая тема:{" "}
            {currentThemeName}
          </p>
        </div>

        <ThemeSwitcher
          theme={theme}
          onThemeChange={onThemeChange}
        />
      </section>

      <section
        className="
          rounded-3xl
          border
          border-white/60
          bg-white/65
          p-5
          shadow-lg
          backdrop-blur-md
        "
      >
        <PetSelector
          selectedPet={selectedPet}
          onSelectPet={onSelectPet}
        />
      </section>

      <BackupPanel />
    </section>
  );
}