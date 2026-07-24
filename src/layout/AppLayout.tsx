import type {
  ReactNode,
} from "react";

import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  themeEmoji: string;
  themeName: string;
};

export default function AppLayout({
  children,
  themeEmoji,
  themeName,
}: Props) {
  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-[1600px]
        flex-col
        gap-6
        lg:flex-row
        lg:items-start
      "
    >
      <Sidebar />

      <main
        className="
          min-w-0
          flex-1
          rounded-3xl
          bg-white/75
          p-4
          shadow-2xl
          backdrop-blur-md
          sm:p-6
        "
      >
        <header
          className="
            mb-8
            flex
            flex-col
            gap-4
            border-b
            border-gray-200/70
            pb-6
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-gray-800
              "
            >
              {themeEmoji} Мой день
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                text-gray-500
              "
            >
              Планируй задачи, сохраняй
              мысли и наблюдай за своим
              прогрессом
            </p>
          </div>

          <div
            className="
              self-start
              rounded-2xl
              bg-white/70
              px-4
              py-2
              text-sm
              font-medium
              text-gray-500
              shadow-sm
            "
          >
            {themeEmoji} {themeName}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}