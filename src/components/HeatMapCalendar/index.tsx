import React, { FC, useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
export interface HeatMapCalendarProps {
  data?: { date: string; value: number }[];
}
const HeatMapCalendar: FC<HeatMapCalendarProps> = ({ data }) => {
  const calInstanceRef = useRef(new CalHeatmap());
  const calHeatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      calInstanceRef.current.paint({
        data: {
          source: data,
          x: "date",
          y: "value",
        },
        date: {
          start: new Date("2023-01-01"),
          locale: "zh",
        },
        range: 12,
        scale: {
          color: {
            // Try some values: Purples, Blues, Turbo, Magma, etc ...
            scheme: "Cool",
            type: "linear",
            domain: [0, 30],
          },
        },
        domain: {
          type: "month",
          // gutter: 10,
        },
        subDomain: { type: "day", label: "DD", width: 15, height: 15 },
      });
    }
  }, [data]);
  return <div id="cal-heatmap" className="mb-6" ref={calHeatmapRef}></div>;
};

export default HeatMapCalendar;
