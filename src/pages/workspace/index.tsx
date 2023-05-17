import { useEffect, useState } from "react";
import styles from "./index.module.less";
import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useLocation } from "react-router-dom";
import "../../i18n/config";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { db } from "../../db";
import {
  Avatar,
  Button,
  Dropdown,
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
import { StrictModeDroppable } from "../../droppable";
import { useLocalStorageState } from "ahooks";
import { useAuth } from "../../auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HabitDTO, HabitsService } from "../../api";
const { Header, Content } = Layout;
const { Title } = Typography;
function App() {
  const [name, setName] = useState("");
  const { user, signout } = useAuth();
  const { t, i18n } = useTranslation();
  const [localeStorage, setLoaleStorage] = useLocalStorageState("locale", {
    defaultValue: "en",
  });
  const habits = useLiveQuery(async () => {
    return db.habits?.orderBy("order").toArray();
  });
  const [sortedHabits, setSortedHabits] = useState(habits);
  useEffect(() => {
    setSortedHabits(habits);
  }, [habits]);
  async function addHabit() {
    try {
      // Add the new friend!
      if (!name) return;
      addMutation.mutate({ name, order: habits?.length || 0 });
      setName("");
    } catch (error) {
      console.error(error);
    }
  }
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLoaleStorage(lng);
  };
  useEffect(() => {
    if (localeStorage) {
      changeLanguage(localeStorage);
    }
  }, [localeStorage]);
  const semiLocale = {
    zh: zh_CN,
    en: en_US,
  } as const;

  const queryClient = useQueryClient();
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
  const { data: habitList } = useQuery({
    queryKey: ["habits"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: HabitsService.habitsControllerFindAll,
  });

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || !habitList) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newHabits = Array.from(habitList);
    const [removed] = newHabits.splice(source.index, 1);
    newHabits.splice(destination.index, 0, removed);
    queryClient.setQueryData(["habits"], newHabits);
    try {
      await updateMutation.mutateAsync({
        id: removed.id,
        name: removed.name,
        order: destination.index,
      });
    } catch (error) {
      // 处理错误，例如显示错误消息
      console.error("Error updating habits order in Dexie:", error);
    }
  };

  const addMutation = useMutation(HabitsService.habitsControllerCreate, {
    onSuccess: (data) => {
      queryClient.setQueryData(["habits"], (oldData?: HabitDTO[]) => {
        return [...(oldData ?? []), data]?.sort((a, b) => a.order - b.order);
      });
    },
  });

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
                    "https://github.com/BarrySong97/Breeze",
                    "_blank"
                  );
                }}
                style={{ marginRight: 10 }}
                icon={<IconGithubLogo size="large" />}
              />
              <Select
                defaultValue="en"
                onChange={(value) => changeLanguage(value as string)}
                value={localeStorage}
                style={{ width: 200, marginRight: 10 }}
                insetLabel={<IconLanguage />}
              >
                <Select.Option value="zh">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
              </Select>
              <Dropdown
                position="bottomRight"
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        signout();
                      }}
                    >
                      退出
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Avatar
                  src={user?.avatar}
                  size="small"
                  color="light-blue"
                  style={{ margin: 4 }}
                ></Avatar>
                <span className="cursor-pointer">{` ${user?.firstname ?? ""} ${
                  user?.lastname ?? ""
                }`}</span>
              </Dropdown>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content style={{ backgroundColor: "#fbfbfb" }} className="overflow-auto">
        <LocaleProvider
          locale={semiLocale[localeStorage as keyof typeof semiLocale]}
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
            </div>
            <div style={{ backgroundColor: "#fbfbfb" }}>
              {habitList && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <StrictModeDroppable droppableId="habitList">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {habitList?.map((habit, index) => (
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

export default App;
