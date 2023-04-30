import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC } from "react";
import { LocaleConsumer } from "@douyinfe/semi-ui";
import MonthsGrid from "@douyinfe/semi-ui/lib/es/datePicker/monthsGrid";
import ConfigContext from "@douyinfe/semi-ui/lib/es/configProvider/context";
import CalendarHeatmap from "react-calendar-heatmap";
import { db } from "../../db";
export interface MonthModalProps extends ModalReactProps {
  dates?: Date[];
  id?: number;
}
const MonthModal: FC<MonthModalProps> = ({ id, ...props }) => {
  const { dates } = props;
  return (
    <Modal
      {...props}
      width={300}
      footer={null}
      // className={styles.habit}
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

                defaultValue={dates}
                multiple={true}
                onChange={(e) => {
                  if (!id) return;
                  db.habits.update(id, { dates: e });
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
