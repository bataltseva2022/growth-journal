import type { PetId } from "../types/pet";

type Props = {
  petId: PetId;
  message: string | null;
  isAnimating: boolean;
  isMinimized: boolean;
  onInteract: () => void;
  onToggleMinimized: () => void;
};

type PetDetails = {
  emoji: string;
  name: string;
};

const petDetails: Record<
  Exclude<PetId, "none">,
  PetDetails
> = {
  cat: {
    emoji: "🐱",
    name: "Котик",
  },

  dog: {
    emoji: "🐶",
    name: "Собачка",
  },

  owl: {
    emoji: "🦉",
    name: "Сова",
  },

  dragon: {
    emoji: "🐉",
    name: "Дракончик",
  },
};

export default function Pet({
  petId,
  message,
  isAnimating,
  isMinimized,
  onInteract,
  onToggleMinimized,
}: Props) {
  if (petId === "none") {
    return null;
  }

  const pet = petDetails[petId];

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={
          onToggleMinimized
        }
        className="
          fixed
          bottom-4
          right-4
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          border
          border-white/80
          bg-white/90
          text-3xl
          shadow-xl
          backdrop-blur-md
          transition
          hover:scale-110
          active:scale-95
          sm:bottom-6
          sm:right-6
        "
        aria-label={`Развернуть питомца: ${pet.name}`}
        title="Развернуть питомца"
      >
        {pet.emoji}
      </button>
    );
  }

  return (
    <div
      className="
        pointer-events-none
        fixed
        bottom-3
        right-3
        z-50
        flex
        max-w-[calc(100vw-24px)]
        flex-col
        items-end
        sm:bottom-6
        sm:right-6
      "
    >
      {message && (
        <div
          className="
            pointer-events-auto
            relative
            mb-2
            max-w-56
            rounded-2xl
            border
            border-white/80
            bg-white/95
            px-4
            py-3
            text-sm
            leading-5
            text-gray-700
            shadow-xl
            backdrop-blur-md
          "
          role="status"
        >
          {message}

          <div
            className="
              absolute
              -bottom-2
              right-8
              h-4
              w-4
              rotate-45
              border-b
              border-r
              border-white/80
              bg-white/95
            "
          />
        </div>
      )}

      <div
        className="
          pointer-events-auto
          relative
          rounded-3xl
          border
          border-white/80
          bg-white/80
          p-2
          shadow-2xl
          backdrop-blur-md
        "
      >
        <button
          type="button"
          onClick={
            onToggleMinimized
          }
          className="
            absolute
            -right-1
            -top-1
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white
            text-xs
            text-gray-400
            shadow
            transition
            hover:text-gray-700
          "
          aria-label="Свернуть питомца"
          title="Свернуть питомца"
        >
          −
        </button>

        <button
          type="button"
          onClick={onInteract}
          className={`
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-2xl
            bg-white/60
            text-6xl
            transition
            hover:scale-105
            active:scale-95
            ${
              isAnimating
                ? "animate-bounce"
                : ""
            }
          `}
          aria-label={`Поговорить с питомцем: ${pet.name}`}
          title={`Нажми на питомца: ${pet.name}`}
        >
          {pet.emoji}
        </button>

        <p
          className="
            mt-1
            text-center
            text-xs
            font-medium
            text-gray-500
          "
        >
          {pet.name}
        </p>
      </div>
    </div>
  );
}