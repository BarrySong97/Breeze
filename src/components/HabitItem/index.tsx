import { Button, Card, Dropdown, Modal, Typography } from "@douyinfe/semi-ui";
import { FC, useMemo } from "react";
import { db, Habit } from "../../db";
import { areDatesOnSameDay, getCurrentWeekDays } from "../../utils/date";
import styles from "./index.module.less";
export interface HabitItemProps {
  data: Habit;
}
const { Text } = Typography;
const HabitItem: FC<HabitItemProps> = ({ data }) => {
  const [weekDays, today] = useMemo(() => getCurrentWeekDays(), []);
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
        render={
          <Dropdown.Menu>
            <Dropdown.Item type="danger" onClick={onDelete}>
              删除
            </Dropdown.Item>
            <Dropdown.Item type="secondary">修改</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Text link className="cursor-pointer">
          更多
        </Text>
      </Dropdown>
    );
  };

  const onCheck = async (day: Date) => {
    if (!data.id) return;
    const habit = await db.habits.get(data.id);
    if (!habit) return;
    const { dates } = habit;
    const index = dates?.findIndex((date) => areDatesOnSameDay(date, day));
    if (index !== undefined && index > -1) {
      dates?.splice(index, 1);
    } else {
      dates?.push(day);
    }
    await db.habits.update(data.id, { dates });
  };
  return (
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
        return (
          <div key={day.getDay()} className="relative">
            <div
              onClick={() => onCheck(day)}
              className={`${styles.dateItem} rounded-full`}
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
  );
};

export default HabitItem;
