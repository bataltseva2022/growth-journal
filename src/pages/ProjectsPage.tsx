import type {
  ComponentProps,
} from "react";

import OrganizationPanel from "../components/OrganizationPanel";

type Props =
  ComponentProps<typeof OrganizationPanel>;

export default function ProjectsPage(
  props: Props
) {
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
          📁 Проекты и темы
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Создавай категории, чтобы
          разделять рабочие, личные и
          другие задачи
        </p>
      </div>

      <OrganizationPanel {...props} />
    </section>
  );
}