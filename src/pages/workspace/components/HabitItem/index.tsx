import { Button, Card, Dropdown, Modal, Space } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { FC, useMemo, useState } from "react";
import { useBoolean } from "ahooks";
import { db, Habit } from "../../../../db";
import {
  areDatesOnSameDay,
  getCurrentWeekDays,
  getWeekDaysMap,
} from "../../../../utils/date";
import MonthModal from "../MonthModal.tsx";
import styles from "./index.module.less";
import { IconMore } from "@douyinfe/semi-icons";
import { MaterialSymbolsCalendarMonth } from "../../../../assets/icons/HeatMapCalendar";
import YearlyModal from "../YearlyModal";
import EditModal from "../EditModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HabitDTO, HabitsService } from "../../../../api";
export interface HabitItemProps {
  data: HabitDTO;
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
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(HabitsService.habitsControllerRemove, {
    onSuccess: (data) => {
      queryClient.setQueryData(["habits"], (oldData?: HabitDTO[]) => {
        return oldData?.filter((item: any) => item.id !== data.id);
      });
    },
  });

  const updateMutation = useMutation(HabitsService.habitsControllerUpdate, {
    onSuccess: (data) => {
      queryClient.setQueryData(["habits"], (oldData?: HabitDTO[]) => {
        const list = oldData?.map((item: any) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });
        list?.sort((a, b) => a.order - b.order);
        return list;
      });
    },
  });

  const onDelete = async () => {
    Modal.error({
      title: t("deleteModal.title"),
      content: t("deleteModal.description"),
      onOk: async () => {
        if (!data.id) return;
        deleteMutation.mutateAsync(data.id);
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

    const { dates = [] } = data;
    const index = dates?.findIndex((v) =>
      areDatesOnSameDay(new Date(v.date), day)
    );
    const checked = dates?.[index];
    if (index !== undefined && index > -1) {
      dates?.splice(index, 1);
    } else {
      dates?.push({
        date: day.toISOString(),
        id: "latest",
        habitId: data.id,
        createdAt: "",
        updatedAt: "",
      });
    }

    queryClient.setQueryData(["habits"], (oldData?: HabitDTO[]) => {
      return [...(oldData ?? [])];
      // return [...(list ?? [])].reverse();
      // return [].push(...(list ?? []));
    });

    const response = await HabitsService.habitsControllerCheck({
      date: day.toISOString(),
      habitId: data.id,
      id: checked?.id,
    });
    queryClient.setQueryData(["habits"], (oldData?: HabitDTO[]) => {
      return oldData?.map((item: HabitDTO) => {
        if (item.id === data.id) {
          dates?.forEach((v) => {
            if (v.id === "latest") {
              v.id = response.id;
              v.createdAt = response.createdAt;
              v.updatedAt = response.updatedAt;
            }
          });
        }
        item.dates = [...dates];
        return item;
      });
    });
  };

  return (
    <>
      <div onClick={() => setOverviewVisible(true)}>
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
            const checked = data.dates?.find((v) =>
              areDatesOnSameDay(new Date(v.date), day)
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
        updateMutation={updateMutation}
        visible={editModalVisible}
        habit={data}
        onCancel={setEditModalHide}
        onOk={setEditModalHide}
      />
      <MonthModal
        title={t("monthModal.title")}
        dates={data.dates}
        id={data.id}
        onCheck={onCheck}
        visible={monthModalVisible}
        onCancel={setMonthModalHide}
        onOk={setMonthModalHide}
      />
      <YearlyModal
        visible={overviewVisible}
        name={data?.name}
        dates={data?.dates}
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
