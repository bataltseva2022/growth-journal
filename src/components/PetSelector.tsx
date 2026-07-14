import type { PetId } from "../types/pet";

type Props = {
  selectedPet: PetId;
  onSelectPet: (
    petId: PetId
  ) => void;
};

type PetOption = {
  id: PetId;
  emoji: string;
  name: string;
  description: string;
};

const petOptions: PetOption[] = [
  {
    id: "cat",
    emoji: "🐱",
    name: "Котик",
    description:
      "Мурчит и поддерживает",
  },

  {
    id: "dog",
    emoji: "🐶",
    name: "Собачка",
    description:
      "Радуется каждому успеху",
  },

  {
    id: "owl",
    emoji: "🦉",
    name: "Сова",
    description:
      "Делится мудрыми мыслями",
  },

  {
    id: "dragon",
    emoji: "🐉",
    name: "Дракончик",
    description:
      "Помогает покорять задачи",
  },

  {
    id: "none",
    emoji: "🚫",
    name: "Без питомца",
    description:
      "Скрыть помощника",
  },
];

export default function PetSelector({
  selectedPet,
  onSelectPet,
}: Props) {
  return (
    <div>
      <div className="mb-4">
        <h3
          className="
            text-lg
            font-bold
            text-gray-800
          "
        >
          🐾 Питомец-помощник
        </h3>

        <p
          className="
            mt-1
            text-sm
            leading-6
            text-gray-500
          "
        >
          Выбери питомца. Он будет
          реагировать на задачи и
          поддерживать тебя.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        {petOptions.map(
          (pet) => {
            const isSelected =
              selectedPet ===
              pet.id;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() =>
                  onSelectPet(
                    pet.id
                  )
                }
                className={`
                  rounded-2xl
                  border
                  p-4
                  text-left
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-md
                  active:scale-95
                  ${
                    isSelected
                      ? `
                        border-pink-300
                        bg-pink-50
                        shadow-md
                        ring-2
                        ring-pink-100
                      `
                      : `
                        border-white/80
                        bg-white/65
                        hover:bg-white/90
                      `
                  }
                `}
                aria-pressed={
                  isSelected
                }
              >
                <div
                  className="
                    mb-3
                    text-4xl
                  "
                >
                  {pet.emoji}
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <span
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >
                    {pet.name}
                  </span>

                  {isSelected && (
                    <span
                      className="
                        text-sm
                        text-pink-500
                      "
                    >
                      ✓
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-400
                  "
                >
                  {pet.description}
                </p>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}