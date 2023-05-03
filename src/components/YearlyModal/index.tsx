import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useMemo, useState } from "react";
import {
  getMaxConsecutiveDays,
  classifyDatesByYearAndMonth,
} from "../../utils/date";
import HeatMapCalendar from "../HeatMapCalendar";
import { Area, AreaConfig } from "@ant-design/plots";
import { Select } from "@douyinfe/semi-ui";
export interface YearlyModalProps extends ModalReactProps {
  dates?: Date[];
}

const today = new Date();
const YearlyModal: FC<YearlyModalProps> = ({ dates, ...props }) => {
  const { visible } = props;
  const [year, setYear] = useState(today.getFullYear());
  const values = dates?.map((date) => {
    return {
      date: date.toISOString(),
      value: 10,
    };
  });
  const consecutiveDays = getMaxConsecutiveDays(dates ?? []);
  const desData = [
    { key: "目前连续天数", value: consecutiveDays.countFromLast },
    { key: "最大连续天数", value: consecutiveDays.maxCount },
  ];
  const style = {
    boxShadow: "var(--semi-shadow-elevated)",
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
    ?.map((v) => ({ month: v.month, count: v.dates.length }));

  const config: AreaConfig = {
    data: currentYearDates,
    xField: "month",
    yField: "count",
    smooth: true,
    // line: null,
    xAxis: {
      range: [0, 1],
      tickCount: 12,
      // tickLine: null,
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
      // rotate: true,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };
  const getYearOptions = () => {
    // const year
  };
  const list = [{ value: "abc", label: "抖音" }];
  return (
    <Modal
      {...props}
      // title={
      //   <Select
      //     value={year}
      //     onChange={(value) => setYear(value as number)}
      //     triggerRender={triggerRender2}
      //     optionList={list}
      //     style={{ width: 240, marginTop: 20, outline: 0 }}
      //   ></Select>
      // }
      width={1150}
    >
      <div className="mb-6 flex">
        {desData.map((v) => {
          return (
            <div style={style} className="flex-1 mr-2" key={v.key}>
              <div>{v.value}</div>
              <div>{v.key}</div>
            </div>
          );
        })}
      </div>

      <HeatMapCalendar data={values} />
      <div className="mb-6">{dates?.length ? <Area {...config} /> : null}</div>
    </Modal>
  );
};

export default YearlyModal;
