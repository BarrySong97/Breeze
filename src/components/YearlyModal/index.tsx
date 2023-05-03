import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC } from "react";
import { getMaxConsecutiveDays } from "../../utils/date";
import HeatMapCalendar from "../HeatMapCalendar";
import { Area } from "@ant-design/plots";
export interface YearlyModalProps extends ModalReactProps {
  dates?: Date[];
}

const YearlyModal: FC<YearlyModalProps> = ({ dates, ...props }) => {
  const { visible } = props;
  const values = dates?.map((date) => {
    return {
      date: date.toISOString(),
      value: 1,
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
  const config = {
    data: values,
    xField: "date",
    yField: "value",
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };
  return (
    <Modal {...props} width={1150}>
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
      <div>
        <Area {...config} />
      </div>
      <HeatMapCalendar data={values} />
    </Modal>
  );
};

export default YearlyModal;
