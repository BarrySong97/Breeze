export function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7; // 今天是星期几？若为0，则为周日
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek + 1
  );
  const result: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    );
    result.push(date);
  }
  return [result, today] as [Date[], Date];
}

export function areDatesOnSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export function getCurrentMonthDays(today?: Date, dates?: Date[]) {
  const currentMonth = today?.getMonth();
  const result = dates?.filter(
    (date) =>
      date.getFullYear() === today?.getFullYear() &&
      date.getMonth() === currentMonth
  );
  result?.sort((a, b) => a.getDate() - b.getDate());
  return result;
}
