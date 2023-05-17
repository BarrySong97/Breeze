import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC } from "react";
import { LocaleConsumer } from "@douyinfe/semi-ui";
import MonthsGrid from "@douyinfe/semi-ui/lib/es/datePicker/monthsGrid";
import ConfigContext from "@douyinfe/semi-ui/lib/es/configProvider/context";
import CalendarHeatmap from "react-calendar-heatmap";
import { db } from "../../../../db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HabitDatesDTO, HabitsService } from "../../../../api";
export interface MonthModalProps extends ModalReactProps {
  dates?: HabitDatesDTO[];
  id?: string;
  onCheck: (day: Date) => Promise<void>;
}
const MonthModal: FC<MonthModalProps> = ({ id, onCheck, ...props }) => {
  const { dates } = props;

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

                defaultValue={dates?.map((v) => new Date(v.date)) ?? []}
                onChangeWithDateFirst
                multiple={true}
                onChange={(e, date) => {
                  if (!id || !e.length) return;
                  onCheck(e[e.length - 1]);
                }}
              />
            )}
          </LocaleConsumer>
        )}
      </ConfigContext.Consumer>
    </Modal>
  );
};

export default MonthModal;
