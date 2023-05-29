import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC } from "react";
import { LocaleConsumer } from "@douyinfe/semi-ui";
import MonthsGrid from "@douyinfe/semi-ui/lib/es/datePicker/monthsGrid";
import ConfigContext from "@douyinfe/semi-ui/lib/es/configProvider/context";
import CalendarHeatmap from "react-calendar-heatmap";
import { db } from "../../../../db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HabitDatesDTO, HabitsService } from "../../../../api";
import classNames from "classnames";
export interface MonthModalProps extends ModalReactProps {
  dates?: HabitDatesDTO[];
  id?: string;
  onCheck: (day: Date, isSelected: boolean) => Promise<void>;
}
const MonthModal: FC<MonthModalProps> = ({ id, onCheck, ...props }) => {
  const { dates } = props;
  const renderFullDate = (
    dayNumber: number,
    fullDate: string,
    dayStatus: Record<string, boolean>
  ) => {
    const { isInRange, isHover, isSelected, isSelectedStart, isSelectedEnd } =
      dayStatus;
    const prefix = "components-datepicker-demo";
    const dateCls = classNames({
      [`${prefix}-day-inrange`]: isInRange,
      [`${prefix}-day-hover`]: isHover,
      [`${prefix}-day-selected`]: isSelected,
      [`${prefix}-day-selected-start`]: isSelectedStart,
      [`${prefix}-day-selected-end`]: isSelectedEnd,
    });
    const dayStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      height: "80%",
      borderRadius: "var(--semi-border-radius-medium)",
    };

    return (
      <div
        onClick={() => {
          onCheck(new Date(fullDate), isSelected);
        }}
        style={dayStyle}
        className={dateCls}
      >
        {dayNumber}
      </div>
    );
  };

  return (
    <Modal
      {...props}
      width={300}
      footer={null}
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ConfigContext.Consumer>
        {({ timeZone }: { timeZone?: string | number }) => (
          <LocaleConsumer componentName={"DatePicker"}>
            {(
              locale: Locale["DatePicker"],
              localeCode: string,
              dateFnsLocale: Locale["dateFnsLocale"]
            ) => (
              <MonthsGrid
                timeZone={timeZone}
                localeCode={localeCode}
                locale={locale}
                // key={localeCode}
                dateFnsLocale={dateFnsLocale}
                // defaultValue={currentMonth}
                renderFullDate={renderFullDate}
                // renderDate={(d: number, s: string) => {
                //   return (
                //     <span
                //       className="checkDate"
                //       onClick={() => {
                //         onCheck(new Date(s));
                //       }}
                //     >
                //       {d}
                //     </span>
                //   );
                // }}
                defaultValue={dates?.map((v) => new Date(v.date)) ?? []}
                multiple={true}
                onChange={() => {}}
              />
            )}
          </LocaleConsumer>
        )}
      </ConfigContext.Consumer>
    </Modal>
  );
};

export default MonthModal;
