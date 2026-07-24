import type {
  ReactNode,
} from "react";

type Props = {
  title: string;
  icon?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  icon,
  description,
  action,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-white/70
        bg-white/70
        p-5
        shadow-lg
        backdrop-blur-md
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-xl
        ${className}
      `}
    >
      <header
        className="
          mb-4
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              flex
              items-center
              gap-2
              text-lg
              font-bold
              text-gray-800
            "
          >
            {icon && (
              <span aria-hidden="true">
                {icon}
              </span>
            )}

            <span>{title}</span>
          </h2>

          {description && (
            <p
              className="
                mt-1
                text-sm
                leading-5
                text-gray-500
              "
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </header>

      <div>{children}</div>
    </section>
  );
}