import {
  NavLink,
  type NavLinkRenderProps,
} from "react-router-dom";

type NavigationItem = {
  to: string;
  label: string;
  icon: string;
};

const navigationItems: NavigationItem[] = [
  {
    to: "/dashboard",
    label: "Главная",
    icon: "🏠",
  },
  {
    to: "/today",
    label: "Сегодня",
    icon: "✨",
  },
  {
    to: "/week",
    label: "Неделя",
    icon: "📋",
  },
  {
    to: "/calendar",
    label: "Календарь",
    icon: "🗓️",
  },
  {
    to: "/projects",
    label: "Проекты",
    icon: "📁",
  },
  {
    to: "/reflection",
    label: "Дневник",
    icon: "💭",
  },
];

function getLinkClasses({
  isActive,
}: NavLinkRenderProps): string {
  const baseClasses = `
    flex
    items-center
    gap-3
    rounded-2xl
    px-4
    py-3
    text-sm
    font-semibold
    transition-all
    duration-200
    active:scale-[0.98]
  `;

  if (isActive) {
    return `
      ${baseClasses}
      bg-pink-500
      text-white
      shadow-md
    `;
  }

  return `
    ${baseClasses}
    text-gray-600
    hover:bg-pink-50
    hover:text-pink-700
  `;
}

export default function Sidebar() {
  return (
    <aside
      className="
        flex
        h-full
        min-h-[calc(100vh-3rem)]
        w-64
        shrink-0
        flex-col
        rounded-3xl
        border
        border-white/70
        bg-white/70
        p-4
        shadow-xl
        backdrop-blur-md
      "
    >
      <div
        className="
          mb-8
          flex
          items-center
          gap-3
          px-2
          pt-2
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-pink-100
            text-2xl
          "
        >
          🌿
        </div>

        <div>
          <p
            className="
              text-lg
              font-bold
              text-gray-800
            "
          >
            Growth Journal
          </p>

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            Твой уютный планировщик
          </p>
        </div>
      </div>

      <nav
        className="
          flex
          flex-1
          flex-col
          gap-2
        "
        aria-label="Основная навигация"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={getLinkClasses}
          >
            <span
              aria-hidden="true"
              className="text-lg"
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div
        className="
          mt-6
          border-t
          border-gray-200/70
          pt-4
        "
      >
        <NavLink
          to="/settings"
          className={getLinkClasses}
        >
          <span
            aria-hidden="true"
            className="text-lg"
          >
            ⚙️
          </span>

          <span>Настройки</span>
        </NavLink>
      </div>
    </aside>
  );
}