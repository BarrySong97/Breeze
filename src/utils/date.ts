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
export const cnWeekdaysMap = new Map<number, string>([
  [0, "日"],
  [1, "一"],
  [2, "二"],
  [3, "三"],
  [4, "四"],
  [5, "五"],
  [6, "六"],
]);
type MaxDays = {
  maxCount: number;
  countFromLast: number;
};

export function getMaxConsecutiveDays(dates: Date[]): MaxDays {
  if (dates.length <= 1) {
    return {
      maxCount: dates.length,
      countFromLast: dates.length,
    };
  }

  dates.sort((a, b) => a.getTime() - b.getTime());

  let maxCount = 1;
  let dp = [1];

  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();

    if (diff === 24 * 3600 * 1000) {
      dp[i] = dp[i - 1] + 1;
    } else {
      dp[i] = 1;
    }

    if (dp[i] > maxCount) {
      maxCount = dp[i];
    }
  }

  return {
    maxCount,
    countFromLast: dp[dp.length - 1],
  };
}
