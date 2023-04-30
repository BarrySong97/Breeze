import { Card, Dropdown, Modal, Typography } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { FC, useMemo } from "react";
import { useBoolean } from "ahooks";
import { db, Habit } from "../../db";
import { areDatesOnSameDay, getCurrentWeekDays } from "../../utils/date";
import MonthModal from "../MonthModal.tsx";
import styles from "./index.module.less";
import "react-calendar-heatmap/dist/styles.css";
export interface HabitItemProps {
  data: Habit;
}
const { Text } = Typography;
const HabitItem: FC<HabitItemProps> = ({ data }) => {
  const [weekDays, today] = useMemo(() => getCurrentWeekDays(), []);
  const [
    monthModalVisible,
    { setTrue: setMonthModalShow, setFalse: setMonthModalHide },
  ] = useBoolean(false);
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
      <Dropdown
        position="bottomLeft"
        trigger="click"
        stopPropagation
        render={
          <Dropdown.Menu>
            <Dropdown.Item type="danger" onClick={onDelete}>
              删除
            </Dropdown.Item>
            <Dropdown.Item type="secondary">修改</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Text
          onClick={(e) => {
            e.stopPropagation();
          }}
          link
          className="cursor-pointer"
        >
          更多
        </Text>
      </Dropdown>
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
      <div onClick={setMonthModalShow}>
        <Card
          shadows="hover"
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
              <div key={day.getDate()} className="relative">
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
      <MonthModal
        title="月视图"
        dates={data.dates}
        visible={monthModalVisible}
        onCancel={setMonthModalHide}
        onOk={setMonthModalHide}
      />
    </>
  );
};

export default HabitItem;
