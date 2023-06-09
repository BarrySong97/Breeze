import { FC, memo, useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import { YearMonthObject } from "../../utils/date";
import moment from "moment";
export interface HeatMapCalendarProps {
  data?: YearMonthObject[];
  lang?: string;
}
const HeatMapCalendar: FC<HeatMapCalendarProps> = ({ data, lang }) => {
  const calInstanceRef = useRef(new CalHeatmap());
  const calHeatmapRef = useRef<HTMLDivElement>(null);
  const dates = data?.reduce((acc, cur) => {
    acc.push(...cur.dates);
    return acc;
  }, [] as Date[]);
  const year = dates?.[0]?.getFullYear();
  useEffect(() => {
    if (data) {
      calInstanceRef.current.paint({
        data: {
          source: dates?.map((v) => ({
            date: moment(v).format("YYYY-MM-DD") ?? "",
            value: 10,
          })),
          x: "date",
          y: "value",
        },
        date: {
          start: new Date(`${year}-01-01`),
          locale: lang,
        },
        range: 12,
        scale: {
          color: {
            scheme: "Cool",
            type: "linear",
            domain: [0, 30],
          },
        },
        domain: {
          type: "month",
        },
        subDomain: { type: "day", label: "DD", width: 15, height: 15 },
      });
    }
  }, [data]);
  return (
    <div
      id="cal-heatmap"
      className="mb-6 w-full overflow-auto"
      ref={calHeatmapRef}
    ></div>
  );
};

export default memo(HeatMapCalendar);
