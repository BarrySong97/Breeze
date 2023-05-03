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

type YearMonthObject = {
  year: number;
  month: number;
  dates: Date[];
};

export function classifyDatesByYearAndMonth(dates: Date[]): YearMonthObject[] {
  const classifiedDates: YearMonthObject[] = [];

  dates.forEach((date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以需要加1

    // 查找是否已有相同年份和月份的对象
    const existingObj = classifiedDates.find(
      (obj) => obj.year === year && obj.month === month
    );

    // 如果存在相同年份和月份的对象，将日期添加到对象的dates数组中
    if (existingObj) {
      existingObj.dates.push(date);
    } else {
      // 如果没有找到相同年份和月份的对象，创建一个新对象并将其添加到结果数组中
      classifiedDates.push({
        year: year,
        month: month,
        dates: [date],
      });
    }
  });
  // 对已分类的年份进行排序
  const sortedYears = Array.from(
    new Set(classifiedDates.map((item) => item.year))
  ).sort((a, b) => a - b);

  // 确保每个年份的每个月份都有一个对象
  sortedYears.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      const existingObj = classifiedDates.find(
        (obj) => obj.year === year && obj.month === month
      );

      if (!existingObj) {
        classifiedDates.push({
          year: year,
          month: month,
          dates: [], // 如果没有日期，则使用空数组
        });
      }
    }
  });
  // 对对象数组按年份和月份进行排序
  return classifiedDates.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.month - b.month;
  });
}
