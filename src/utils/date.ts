export function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay() - 1; // 转换为0~6的数字，其中0代表周日，1代表周一，以此类推
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  ); // 本周第一天
  const result = [];
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
