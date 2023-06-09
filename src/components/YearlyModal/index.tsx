import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useMemo, useState } from "react";
import { classifyDatesByYearAndMonth } from "../../utils/date";
import { Select, SideSheet } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import YearlyContent from "../YearlyContent";
export interface YearlyModalProps extends ModalReactProps {
  dates?: Date[];
  name?: string;
  mobile: boolean;
}

const today = new Date();
const YearlyModal: FC<YearlyModalProps> = ({
  mobile,
  name,
  dates,
  ...props
}) => {
  const [year, setYear] = useState(today.getFullYear());

  const calendarDates = useMemo(
    () => classifyDatesByYearAndMonth(dates ?? []),
    [dates]
  );
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
  const renderTitle = () => {
    return (
      <div className="flex items-center">
        {name}
        <Select
          value={year}
          onChange={(value) => setYear(value as number)}
          triggerRender={triggerRender2 as any}
          optionList={list}
          style={{ outline: 0 }}
        ></Select>
      </div>
    );
  };
  const renderContent = () => {
    return <YearlyContent dates={dates} year={year} />;
  };
  const title = renderTitle();
  const content = renderContent();
  const renderSide = () => {
    return (
      <SideSheet
        title={title}
        visible={props.visible}
        onCancel={(e) => props.onCancel?.(e as any)}
        width={"100vw"}
      >
        {content}
      </SideSheet>
    );
  };

  const renderModal = () => {
    return (
      <Modal {...props} title={title} width={1150}>
        {content}
      </Modal>
    );
  };
  return mobile ? renderSide() : renderModal();
};

export default YearlyModal;
