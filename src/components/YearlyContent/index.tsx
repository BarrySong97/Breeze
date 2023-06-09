import { FC, useMemo, useState } from "react";
import {
  getMaxConsecutiveDays,
  classifyDatesByYearAndMonth,
} from "../../utils/date";
import HeatMapCalendar from "../HeatMapCalendar";
import { Area, AreaConfig } from "@ant-design/plots";
import styles from "./index.module.less";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Typography } from "@douyinfe/semi-ui";
export interface YearlyContentProps {
  dates?: Date[];
  year: number;
}
const { Title } = Typography;
const YearlyContent: FC<YearlyContentProps> = ({ dates, year }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const consecutiveDays = getMaxConsecutiveDays(dates ?? []);

  const desData = [
    {
      key: t("yearModal.desDate.startedDate"),
      value: moment(dates?.[0]).format("YYYY-MM-DD") ?? 0,
    },
    {
      key: t("yearModal.desDate.currentConsecutiveDays"),
      value: consecutiveDays.countFromLast,
    },
    {
      key: t("yearModal.desDate.maximumConsecutiveDays"),
      value: consecutiveDays.maxCount,
    },
    {
      key: t("yearModal.desDate.checkedDays"),
      value: dates?.length ?? 0,
    },
  ];
  const style = {
    backgroundColor: "var(--semi-color-bg-2)",
    borderRadius: "4px",
    padding: "10px",
  };
  const calendarDates = useMemo(
    () => classifyDatesByYearAndMonth(dates ?? []),
    [dates]
  );
  const currentYearDates = calendarDates
    .filter((v) => v.year === year)
    ?.map((v) => ({ count: v.dates.length, ...v }));
  console.log(currentYearDates);

  const config: AreaConfig = {
    data: currentYearDates.map((v) => ({
      month: v.month + "",
      count: v.count,
    })),
    xField: "month",
    yField: "count",
    smooth: true,
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      grid: null,
    },
    label: {
      style: {
        fill: "blue",
        opacity: 0.6,
        fontSize: 12,
      },
      position: "middle",
      // rotate: true,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  return (
    <>
      <div className={`mb-6  ${styles.desc}`}>
        {desData.map((v) => {
          return (
            <div style={style} className={`${styles.descItem}`} key={v.key}>
              <div className="text-lg font-semibold">{v.value}</div>
              <div>{v.key}</div>
            </div>
          );
        })}
      </div>
      <div>
        <Title heading={6}>{t("yearModal.calendarTitle")}</Title>
        <div className="h-4"></div>
        <HeatMapCalendar lang={currentLang} data={currentYearDates} />
      </div>
      {dates?.length ? (
        <div>
          <Title heading={6}>{t("yearModal.lineChartTitle")}</Title>
          <div className="h-4"></div>

          <div className="mb-6">
            <Area {...config} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default YearlyContent;
