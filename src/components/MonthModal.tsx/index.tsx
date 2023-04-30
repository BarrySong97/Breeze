import Modal, { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import { FC, useMemo, useState } from "react";
import { LocaleConsumer } from "@douyinfe/semi-ui";
import MonthsGrid from "@douyinfe/semi-ui/lib/es/datePicker/monthsGrid";
import ConfigContext from "@douyinfe/semi-ui/lib/es/configProvider/context";
import { getCurrentMonthDays } from "../../utils/date";
export interface MonthModalProps extends ModalReactProps {
  dates?: Date[];
}
const today = new Date();
const MonthModal: FC<MonthModalProps> = ({ ...props }) => {
  const { dates } = props;
  const [pane, setPane] = useState<Date>(today);
  const [value, onChange] = useState<Date>(new Date());

  const currentMonth = useMemo(
    () => getCurrentMonthDays(pane, dates),
    [pane, dates]
  );

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

                defaultValue={currentMonth}
                multiple={true}
                onPanelChange={(e) => {
                  setPane(e as Date);
                }}
                onChange={(e) => {
                  console.log(e);
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
