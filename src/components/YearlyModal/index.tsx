import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import CalendarHeatmap from "react-calendar-heatmap";
import { FC } from "react";
import { getMaxConsecutiveDays } from "../../utils/date";
import { Descriptions } from "@douyinfe/semi-ui";
export interface YearlyModalProps extends ModalReactProps {
  dates?: Date[];
}
const YearlyModal: FC<YearlyModalProps> = ({ dates, ...props }) => {
  const values = dates?.map((date) => {
    return {
      date: date.toISOString(),
      count: 1,
    };
  });
  const consecutiveDays = getMaxConsecutiveDays(dates ?? []);
  const data = [
    { key: "目前连续天数", value: consecutiveDays.countFromLast },
    { key: "最大连续天数", value: consecutiveDays.maxCount },
  ];
  const style = {
    boxShadow: "var(--semi-shadow-elevated)",
    backgroundColor: "var(--semi-color-bg-2)",
    borderRadius: "4px",
    padding: "10px",
  };
  return (
    <Modal {...props} width={800}>
      <div className="mb-6 flex">
        {data.map((v) => {
          return (
            <div style={style} className="flex-1 mr-2" key={v.key}>
              <div>{v.value}</div>
              <div>{v.key}</div>
            </div>
          );
        })}
      </div>

      <CalendarHeatmap
        showWeekdayLabels
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-scale`;
        }}
        monthLabels={[
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ]}
        weekdayLabels={["周日", "周一", "周二", "周三", "周四", "周五", "周六"]}
        startDate={new Date("2023-01-01")}
        endDate={new Date("2023-12-31")}
        values={values ?? []}
      />
    </Modal>
  );
};

export default YearlyModal;
