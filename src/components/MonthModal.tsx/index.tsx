import Calendar from "react-calendar";
import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useState } from "react";
import { TabPane, Tabs } from "@douyinfe/semi-ui";
import CalendarHeatmap from "react-calendar-heatmap";
export interface MonthModalProps extends ModalReactProps {
  dates?: Date[];
}
const MonthModal: FC<MonthModalProps> = ({ ...props }) => {
  const { dates } = props;
  const [value, onChange] = useState<Date>(new Date());
  const values = dates?.map((date) => {
    return {
      date: date.toISOString(),
      count: 1,
    };
  });
  return (
    <Modal
      {...props}
      width={850}
      footer={null}
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CalendarHeatmap
        showWeekdayLabels
        startDate={new Date("2023-01-01")}
        endDate={new Date("2023-12-31")}
        values={values ?? []}
      />
    </Modal>
  );
};

export default MonthModal;
