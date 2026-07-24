import type {
  ComponentProps,
} from "react";

import WeekBoard from "../components/WeekBoard";

type Props =
  ComponentProps<typeof WeekBoard>;

export default function WeekPage(
  props: Props
) {
  return (
    <section
      className="
        overflow-x-auto
        rounded-3xl
        bg-white/65
        p-4
        shadow-lg
        backdrop-blur-sm
        sm:p-6
      "
    >
      <WeekBoard {...props} />
    </section>
  );
}