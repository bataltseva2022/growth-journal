import { Link } from "react-router-dom";

import DashboardCard from "../components/common/DashboardCard";
import type { PomodoroMode } from "../hooks/usePomodoro";

type DashboardTask = {
  id: number;
  text: string;
  done: boolean;
};

type Props = {
  tasks: DashboardTask[];
  onToggleTask: (taskId: number) => void;

  pomodoroMode: PomodoroMode;
  pomodoroFormattedTime: string;
  isPomodoroRunning: boolean;
  completedPomodoroSessions: number;
  pomodoroProgress: number;
  onTogglePomodoro: () => void;
  onResetPomodoro: () => void;
  onSkipPomodoro: () => void;
};

const linkClasses = `
  inline-flex
  items-center
  justify-center
  rounded-2xl
  bg-pink-500
  px-4
  py-2.5
  text-sm
  font-semibold
  text-white
  shadow-md
  transition
  hover:bg-pink-600
  active:scale-95
`;

const secondaryLinkClasses = `
  inline-flex
  items-center
  gap-1
  text-sm
  font-semibold
  text-pink-600
  transition
  hover:text-pink-700
`;

function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour < 6) {
    return "Доброй ночи";
  }

  if (currentHour < 12) {
    return "Доброе утро";
  }

  if (currentHour < 18) {
    return "Добрый день";
  }

  return "Добрый вечер";
}

function getFormattedDate(): string {
  return new Intl.DateTimeFormat(
    "ru-RU",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  ).format(new Date());
}

export default function DashboardPage({
  tasks,
  onToggleTask,
  pomodoroMode,
  pomodoroFormattedTime,
  isPomodoroRunning,
  completedPomodoroSessions,
  pomodoroProgress,
  onTogglePomodoro,
  onResetPomodoro,
  onSkipPomodoro,
}: Props) {
  const completedTasksCount =
    tasks.filter((task) => task.done).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasksCount /
            tasks.length) *
            100
        );

  const visibleTasks = tasks.slice(0, 5);
  const hiddenTasksCount =
    Math.max(
      tasks.length - visibleTasks.length,
      0
    );

  return (
    <div className="space-y-6">
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/70
          bg-gradient-to-r
          from-pink-100/80
          via-purple-100/70
          to-blue-100/70
          p-6
          shadow-lg
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                capitalize
                text-gray-500
              "
            >
              {getFormattedDate()}
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-bold
                text-gray-800
              "
            >
              {getGreeting()} ✨
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-gray-600
              "
            >
              Здесь собрано всё самое
              важное на сегодня: задачи,
              фокус, настроение и прогресс.
            </p>
          </div>

          <div
            className="
              flex
              h-24
              w-24
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/60
              text-5xl
              shadow-inner
            "
            aria-hidden="true"
          >
            🌱
          </div>
        </div>
      </section>

      <div
        className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-12
        "
      >
        <DashboardCard
          title="Задачи на сегодня"
          icon="✅"
          description={
            tasks.length > 0
              ? `Выполнено ${completedTasksCount} из ${tasks.length}`
              : "На сегодня пока нет задач"
          }
          className="xl:col-span-7"
          action={
            <Link
              to="/today"
              className={
                secondaryLinkClasses
              }
            >
              Все задачи
              <span aria-hidden="true">
                →
              </span>
            </Link>
          }
        >
          {tasks.length === 0 ? (
            <div
              className="
                rounded-2xl
                bg-pink-50/70
                p-5
              "
            >
              <p
                className="
                  text-sm
                  leading-6
                  text-gray-600
                "
              >
                Добавь первое дело на
                сегодня, чтобы оно
                появилось на главной
                странице.
              </p>

              <Link
                to="/today"
                className={`
                  ${linkClasses}
                  mt-4
                `}
              >
                Добавить задачу
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  <span>Прогресс дня</span>
                  <span>{progress}%</span>
                </div>

                <div
                  className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-pink-100
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-pink-500
                      transition-all
                      duration-300
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <ul className="space-y-2">
                {visibleTasks.map(
                  (task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() =>
                          onToggleTask(
                            task.id
                          )
                        }
                        className="
                          flex
                          w-full
                          items-start
                          gap-3
                          rounded-2xl
                          border
                          border-pink-100/80
                          bg-white/75
                          px-4
                          py-3
                          text-left
                          transition
                          hover:border-pink-200
                          hover:bg-pink-50/60
                          active:scale-[0.99]
                        "
                        aria-label={
                          task.done
                            ? `Вернуть задачу «${task.text}» в работу`
                            : `Отметить задачу «${task.text}» выполненной`
                        }
                      >
                        <span
                          className={`
                            mt-0.5
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            text-xs
                            font-bold
                            ${
                              task.done
                                ? "border-pink-500 bg-pink-500 text-white"
                                : "border-pink-300 bg-white text-transparent"
                            }
                          `}
                          aria-hidden="true"
                        >
                          ✓
                        </span>

                        <span
                          className={`
                            min-w-0
                            flex-1
                            text-sm
                            leading-5
                            ${
                              task.done
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {task.text}
                        </span>
                      </button>
                    </li>
                  )
                )}
              </ul>

              {hiddenTasksCount > 0 && (
                <p
                  className="
                    text-center
                    text-xs
                    font-medium
                    text-gray-400
                  "
                >
                  Ещё задач:{" "}
                  {hiddenTasksCount}
                </p>
              )}
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Фокус"
          icon={
            pomodoroMode === "focus"
              ? "⏳"
              : "☕"
          }
          description={
            pomodoroMode === "focus"
              ? "Сосредоточься на одном деле"
              : "Небольшая пауза перед следующей сессией"
          }
          className="xl:col-span-5"
        >
          <div
            className={`
              flex
              flex-col
              items-center
              rounded-2xl
              px-5
              py-6
              text-center
              ${
                pomodoroMode === "focus"
                  ? "bg-purple-50/70"
                  : "bg-emerald-50/70"
              }
            `}
          >
            <div
              className="
                flex
                w-full
                items-center
                justify-between
                gap-3
              "
            >
              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  ${
                    pomodoroMode === "focus"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-emerald-100 text-emerald-700"
                  }
                `}
              >
                {pomodoroMode === "focus"
                  ? "Рабочая сессия"
                  : "Короткий перерыв"}
              </span>

              <span
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Сессий сегодня:{" "}
                {completedPomodoroSessions}
              </span>
            </div>

            <p
              className="
                mt-5
                text-5xl
                font-bold
                tabular-nums
                text-gray-800
                sm:text-6xl
              "
              aria-live="polite"
            >
              {pomodoroFormattedTime}
            </p>

            <div
              className="
                mt-5
                h-2
                w-full
                overflow-hidden
                rounded-full
                bg-white/80
              "
              aria-label={`Прогресс сессии: ${pomodoroProgress}%`}
            >
              <div
                className={`
                  h-full
                  rounded-full
                  transition-[width]
                  duration-300
                  ${
                    pomodoroMode === "focus"
                      ? "bg-purple-500"
                      : "bg-emerald-500"
                  }
                `}
                style={{
                  width: `${pomodoroProgress}%`,
                }}
              />
            </div>

            <p
              className="
                mt-4
                text-sm
                leading-5
                text-gray-500
              "
            >
              {isPomodoroRunning
                ? pomodoroMode === "focus"
                  ? "Таймер идёт. Останься с одной задачей."
                  : "Отдохни: встань, попей воды или посмотри в окно."
                : pomodoroMode === "focus"
                  ? "Запусти 25 минут спокойной работы."
                  : "Запусти пятиминутный перерыв."}
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
              "
            >
              <button
                type="button"
                onClick={onTogglePomodoro}
                className={`
                  rounded-2xl
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition
                  active:scale-95
                  ${
                    pomodoroMode === "focus"
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }
                `}
              >
                {isPomodoroRunning
                  ? "Пауза"
                  : pomodoroProgress > 0
                    ? "Продолжить"
                    : "Начать"}
              </button>

              <button
                type="button"
                onClick={onResetPomodoro}
                className="
                  rounded-2xl
                  bg-white/85
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-600
                  shadow-sm
                  transition
                  hover:bg-white
                  active:scale-95
                "
              >
                Сбросить
              </button>

              <button
                type="button"
                onClick={onSkipPomodoro}
                className="
                  rounded-2xl
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-500
                  transition
                  hover:bg-white/70
                  hover:text-gray-700
                  active:scale-95
                "
              >
                {pomodoroMode === "focus"
                  ? "К перерыву →"
                  : "К фокусу →"}
              </button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Календарь"
          icon="🗓️"
          description="Посмотреть планы по датам"
          className="xl:col-span-4"
        >
          <Link
            to="/calendar"
            className={
              secondaryLinkClasses
            }
          >
            Открыть календарь
            <span aria-hidden="true">
              →
            </span>
          </Link>
        </DashboardCard>

        <DashboardCard
          title="Прогресс"
          icon="📊"
          description="Выполнение задач за сегодня"
          className="xl:col-span-4"
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-3xl
                  font-bold
                  text-gray-800
                "
              >
                {completedTasksCount}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                выполнено сегодня
              </p>
            </div>

            <p
              className="
                text-2xl
                font-bold
                text-pink-500
              "
            >
              {progress}%
            </p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Проекты"
          icon="📁"
          description="Рабочие и личные направления"
          className="xl:col-span-4"
        >
          <Link
            to="/projects"
            className={
              secondaryLinkClasses
            }
          >
            Открыть проекты
            <span aria-hidden="true">
              →
            </span>
          </Link>
        </DashboardCard>

        <DashboardCard
          title="Как прошёл день?"
          icon="💭"
          description="Сохрани настроение и несколько мыслей"
          className="xl:col-span-12"
        >
          <div
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              bg-blue-50/60
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                max-w-2xl
                text-sm
                leading-6
                text-gray-600
              "
            >
              Вечером можно отметить
              настроение, записать успехи
              и то, что хотелось бы
              улучшить.
            </p>

            <Link
              to="/reflection"
              className={linkClasses}
            >
              Открыть дневник
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}