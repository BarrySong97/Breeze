import { Button, Card, Dropdown, Modal, Space } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { FC, useMemo, useState } from "react";
import { useBoolean } from "ahooks";
import { db, Habit } from "../../db";
import {
  areDatesOnSameDay,
  getCurrentWeekDays,
  getWeekDaysMap,
} from "../../utils/date";
import MonthModal from "../MonthModal.tsx";
import styles from "./index.module.less";
import { IconMore } from "@douyinfe/semi-icons";
import { MaterialSymbolsCalendarMonth } from "../../assets/icons/HeatMapCalendar";
import YearlyModal from "../YearlyModal";
import EditModal from "../EditModal";
export interface HabitItemProps {
  data: Habit;
}
const HabitItem: FC<HabitItemProps> = ({ data }) => {
  const [weekDays, today] = useMemo(() => getCurrentWeekDays(), []);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [
    monthModalVisible,
    { setTrue: setMonthModalShow, setFalse: setMonthModalHide },
  ] = useBoolean(false);
  const [
    editModalVisible,
    { setTrue: setEditModalShow, setFalse: setEditModalHide },
  ] = useBoolean(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const onDelete = async () => {
    Modal.error({
      title: "删除习惯",
      content: "是否删除该习惯， 一旦删除数据将无法恢复",
      onOk: async () => {
        if (!data.id) return;
        await db.habits.delete(data.id);
      },
    });
  };
  const renderDropDown = () => {
    return (
      <Space>
        <Button
          icon={<MaterialSymbolsCalendarMonth fontSize={20} />}
          onClick={(e) => {
            e.stopPropagation();
            setMonthModalShow();
          }}
          type="tertiary"
          theme="borderless"
        ></Button>
        <Dropdown
          position="bottomLeft"
          trigger="click"
          clickToHide
          stopPropagation
          render={
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(e) => {
                  setEditModalShow();
                }}
              >
                {t("habitItem.edit")}
              </Dropdown.Item>
              <Dropdown.Item type="danger" onClick={onDelete}>
                {t("habitItem.delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button
            icon={<IconMore />}
            type="tertiary"
            onClick={(e) => {
              e.stopPropagation();
            }}
            theme="borderless"
          ></Button>
        </Dropdown>
      </Space>
    );
  };

  const onCheck = async (day: Date) => {
    if (!data.id) return;
    const habit = await db.habits.get(data.id);
    if (!habit) return;
    const { dates = [] } = habit;
    const index = dates?.findIndex((date) => areDatesOnSameDay(date, day));
    if (index !== undefined && index > -1) {
      dates?.splice(index, 1);
    } else {
      dates?.push(day);
    }
    await db.habits.update(data.id, { dates });
  };

  return (
    <>
      <div onClick={() => setOverviewVisible(true)}>
        <Card
          // shadows="hover"
          className={`${styles.habit} `}
          title={data.name}
          headerExtraContent={renderDropDown()}
          bodyStyle={{ display: "flex", justifyContent: "space-between" }}
          style={{ marginBottom: 12 }}
        >
          {weekDays.map((day) => {
            const isToday = areDatesOnSameDay(day, today);
            const checked = data.dates?.find((date) =>
              areDatesOnSameDay(date, day)
            );
            const checkedClassName = classNames({
              [styles.checkedItem]: checked,
            });

            return (
              <div
                key={day.getDate()}
                className="relative flex flex-col items-center "
              >
                <div className="mb-2 font-bold">
                  {getWeekDaysMap(currentLanguage).get(day.getDay())}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheck(day);
                  }}
                  className={`${styles.dateItem} ${checkedClassName}  rounded-full cursor-pointer`}
                >
                  {day.getDate()}
                </div>
                <div
                  style={{
                    display: isToday ? "flex" : "none",
                  }}
                  className={`${styles.today} rounded-full absolute  flex justify-center w-full `}
                ></div>
              </div>
            );
          })}
        </Card>
      </div>
      <EditModal
        title={t("editModal.title")}
        visible={editModalVisible}
        habit={data}
        onCancel={setEditModalHide}
        onOk={setEditModalHide}
      />
      <MonthModal
        title={t("monthModal.title")}
        dates={data.dates}
        id={data.id}
        visible={monthModalVisible}
        onCancel={setMonthModalHide}
        onOk={setMonthModalHide}
      />
      <YearlyModal
        visible={overviewVisible}
        dates={data.dates}
        footer={null}
        onCancel={() => {
          setOverviewVisible(false);
        }}
        onOk={() => {
          setOverviewVisible(false);
        }}
      />
    </>
  );
};

export default HabitItem;
