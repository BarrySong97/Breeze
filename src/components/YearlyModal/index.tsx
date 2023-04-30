import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import CalendarHeatmap from "react-calendar-heatmap";
import { FC } from "react";
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
  return (
    <Modal {...props} width={800}>
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
