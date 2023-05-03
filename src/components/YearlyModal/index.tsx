import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useMemo, useState } from "react";
import {
  getMaxConsecutiveDays,
  classifyDatesByYearAndMonth,
} from "../../utils/date";
import HeatMapCalendar from "../HeatMapCalendar";
import { Area, AreaConfig } from "@ant-design/plots";
import { Select } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { TriggerRenderProps } from "@douyinfe/semi-ui/lib/es/cascader";
export interface YearlyModalProps extends ModalReactProps {
  dates?: Date[];
}

const today = new Date();
const YearlyModal: FC<YearlyModalProps> = ({ dates, ...props }) => {
  const { visible } = props;
  const [year, setYear] = useState(today.getFullYear());
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
    ?.map((v) => ({ count: v.dates.length, ...v }));

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
      position: "middle",
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
    const year = [...new Set(calendarDates.map((v) => v.year))];

    return year.map((v) => ({
      value: v,
      label: v,
    }));
  };
  const list = getYearOptions();
  const triggerRender2 = ({
    value,
  }: {
    value: { label: string; value: string }[];
  }) => {
    return (
      <div
        style={{
          minWidth: "112",
          height: 32,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            margin: 4,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flexGrow: 1,
            cursor: "pointer",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {value
            .map((item: { value: string; label: string }) => item.label)
            .join(" , ")}
          <IconChevronDown style={{ margin: "0 8px", flexShrink: 0 }} />
        </div>
      </div>
    );
  };
  return (
    <Modal
      {...props}
      title={
        <Select
          value={year}
          onChange={(value) => setYear(value as number)}
          triggerRender={triggerRender2 as any}
          optionList={list}
          style={{ outline: 0 }}
        ></Select>
      }
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
      <HeatMapCalendar data={currentYearDates} />
      <div className="mb-6">{dates?.length ? <Area {...config} /> : null}</div>
    </Modal>
  );
};

export default YearlyModal;
