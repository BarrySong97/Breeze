import { useState } from "react";
import styles from "./App.module.less";
import { useLiveQuery } from "dexie-react-hooks";
import "./i18n/config";
import { useTranslation } from "react-i18next";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { db } from "./db";
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
const { Header, Content } = Layout;
const { Title } = Typography;
function TimeScale() {
  const [name, setName] = useState("");
  const { t, i18n } = useTranslation();
  const habits = useLiveQuery(() => db.habits?.toArray());

  const currentLanguage = i18n.language;
  async function addHabit() {
    try {
      // Add the new friend!
      if (!name) return;
      await db.habits.add({
        name,
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
            <div className="flex sticky top-0 py-4 bg-white z-30">
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
            <div>
              {habits?.map((habit) => (
                <HabitItem key={habit.id} data={habit} />
              ))}
            </div>
          </div>
        </LocaleProvider>
      </Content>
    </Layout>
  );
}

export default TimeScale;
