import { useEffect, useState } from "react";
import styles from "./App.module.less";
import { useLiveQuery } from "dexie-react-hooks";
import "./i18n/config";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { db, Habit } from "./db";
import {
  Button,
  Input,
  Layout,
  LocaleProvider,
  Nav,
  Select,
  Typography,
} from "@douyinfe/semi-ui";
import HabitItem from "./components/HabitItem";
import { IconGithubLogo, IconLanguage } from "@douyinfe/semi-icons";
import type { DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./droppable";
const { Header, Content } = Layout;
const { Title } = Typography;
function TimeScale() {
  const [name, setName] = useState("");
  const { t, i18n } = useTranslation();
  const habits = useLiveQuery(async () => {
    return db.habits?.orderBy("order").toArray();
  });
  const [sortedHabits, setSortedHabits] = useState(habits);
  useEffect(() => {
    setSortedHabits(habits);
  }, [habits]);
  const currentLanguage = i18n.language;
  async function addHabit() {
    try {
      // Add the new friend!
      if (!name) return;
      await db.habits.add({
        name,
        order: 0,
      });
      setName("");
    } catch (error) {
      console.error(error);
    }
  }
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const semiLocale = {
    zh: zh_CN,
    en: en_US,
  } as const;

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || !sortedHabits) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newHabits = Array.from(sortedHabits);
    const [removed] = newHabits.splice(source.index, 1);
    newHabits.splice(destination.index, 0, removed);
    setSortedHabits(newHabits);
    try {
      await db.transaction("rw", db.habits, async () => {
        // 获取当前习惯列表并调整顺序
        const currentHabits = await db.habits?.orderBy("order").toArray();
        const [removed] = currentHabits.splice(source.index, 1);
        currentHabits.splice(destination.index, 0, removed);

        // 更新受影响的习惯顺序
        const startIndex = Math.min(source.index, destination.index);
        const endIndex = Math.max(source.index, destination.index);
        for (let i = startIndex; i <= endIndex; i++) {
          const habit = currentHabits[i];
          await db.habits.put({ ...habit, order: i });
        }
      });
    } catch (error) {
      // 处理错误，例如显示错误消息
      console.error("Error updating habits order in Dexie:", error);
    }
  };
  return (
    <Layout className="h-screen">
      <Header style={{ backgroundColor: "var(--semi-color-bg-2)" }}>
        <div>
          <Nav mode="horizontal">
            <Nav.Header>
              <Title>Breeze</Title>
            </Nav.Header>
            <Nav.Footer>
              <Button
                theme="borderless"
                type="tertiary"
                onClick={() => {
                  window.open(
                    "https://github.com/BarrySong97?tab=repositories",
                    "_blank"
                  );
                }}
                style={{ marginRight: 10 }}
                icon={<IconGithubLogo size="large" />}
              />
              <Select
                defaultValue="en"
                onChange={(value) => changeLanguage(value as string)}
                style={{ width: 200, marginRight: 10 }}
                insetLabel={<IconLanguage />}
              >
                <Select.Option value="zh">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
              </Select>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content style={{ backgroundColor: "#fbfbfb" }} className="overflow-auto">
        <LocaleProvider
          locale={semiLocale[currentLanguage as keyof typeof semiLocale]}
        >
          <div className={`${styles.home} `}>
            <div
              style={{ backgroundColor: "#fbfbfb" }}
              className="flex sticky top-0 py-4  z-30"
            >
              <Input
                className="mr-2"
                type="text"
                value={name}
                onEnterPress={addHabit}
                onChange={(e) => setName(e)}
              />
              <Button onClick={addHabit} theme="solid" type="primary">
                {t("home.action.add")}
              </Button>
              {/* <Button
                type="tertiary"
                // theme="borderless"
                style={{ marginLeft: 10 }}
                icon={<IconAscend />}
              ></Button> */}
            </div>
            <div style={{ backgroundColor: "#fbfbfb" }}>
              {sortedHabits && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <StrictModeDroppable droppableId="habitList">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {sortedHabits?.map((habit, index) => (
                          <Draggable
                            key={habit.id}
                            draggableId={habit.id + ""}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: "16px", // 或者您需要的间距大小
                                }}
                              >
                                <HabitItem data={habit} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </LocaleProvider>
      </Content>
    </Layout>
  );
}

export default TimeScale;
