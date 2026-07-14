export type AppTab =
  | "today"
  | "week"
  | "calendar"
  | "projects"
  | "reflection"
  | "settings";

type Props = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

type NavigationItem = {
  id: AppTab;
  label: string;
  icon: string;
};

const mainTabs: NavigationItem[] = [
  {
    id: "today",
    label: "Сегодня",
    icon: "✨",
  },
  {
    id: "week",
    label: "Неделя",
    icon: "📋",
  },
  {
    id: "calendar",
    label: "Календарь",
    icon: "🗓️",
  },
  {
    id: "projects",
    label: "Проекты",
    icon: "📁",
  },
  {
    id: "reflection",
    label: "Рефлексия",
    icon: "💭",
  },
];

export default function AppNavigation({
  activeTab,
  onTabChange,
}: Props) {
  function getButtonClasses(
    tabId: AppTab
  ): string {
    const baseClasses = `
      flex
      shrink-0
      items-center
      justify-center
      gap-2
      rounded-2xl
      px-4
      py-2.5
      text-sm
      font-semibold
      transition-all
      duration-200
      active:scale-95
    `;

    if (activeTab === tabId) {
      return `
        ${baseClasses}
        bg-pink-500
        text-white
        shadow-md
      `;
    }

    return `
      ${baseClasses}
      bg-white/60
      text-gray-600
      hover:bg-pink-50
      hover:text-pink-700
    `;
  }

  return (
    <nav
      className="
        mb-8
        overflow-x-auto
        rounded-3xl
        border
        border-white/60
        bg-white/55
        p-2
        shadow-lg
        backdrop-blur-md
      "
      aria-label="Разделы планировщика"
    >
      <div
        className="
          flex
          min-w-max
          items-center
          gap-2
        "
      >
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              onTabChange(tab.id)
            }
            className={getButtonClasses(
              tab.id
            )}
            aria-current={
              activeTab === tab.id
                ? "page"
                : undefined
            }
          >
            <span
              aria-hidden="true"
              className="text-base"
            >
              {tab.icon}
            </span>

            <span>{tab.label}</span>
          </button>
        ))}

        <div
          className="
            mx-1
            h-8
            w-px
            shrink-0
            bg-gray-200/80
          "
        />

        <button
          type="button"
          onClick={() =>
            onTabChange("settings")
          }
          className={getButtonClasses(
            "settings"
          )}
          aria-current={
            activeTab === "settings"
              ? "page"
              : undefined
          }
        >
          <span
            aria-hidden="true"
            className="text-base"
          >
            ⚙️
          </span>

          <span>Настройки</span>
        </button>
      </div>
    </nav>
  );
}