// ===============================
// Работа с датами без UTC-сдвигов
// ===============================

// Форматирование Date -> YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Создание локальной даты из строки YYYY-MM-DD
export function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// Сегодня
export function getToday(): string {
  return formatDate(new Date());
}

// Понедельник недели
export function getMonday(date: Date): Date {
  const monday = new Date(date);

  const day = monday.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);

  return monday;
}

// Все дни недели (Пн-Вс)
export function getWeekDays(selectedDate: string): Date[] {
  const monday = getMonday(parseDate(selectedDate));

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);

    day.setDate(monday.getDate() + index);

    return day;
  });
}

// Дни месяца
export function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  const result: (Date | null)[] = [];

  let weekday = firstDay.getDay();

  weekday = weekday === 0 ? 7 : weekday;

  for (let i = 1; i < weekday; i++) {
    result.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    result.push(new Date(year, month, day));
  }

  return result;
}