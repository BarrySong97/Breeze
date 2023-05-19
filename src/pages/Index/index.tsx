import { IconArrowUpRight } from "@douyinfe/semi-icons";
import { Avatar, Typography } from "@douyinfe/semi-ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  IcBaselineApple,
  MaterialSymbolsAndroid,
  SimpleIconsPwa,
} from "../../assets/icons";
import { useAuth } from "../../auth";
import styles from "./index.module.less";
export interface IndexProps {}
const { Title } = Typography;
const Index: FC<IndexProps> = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const renderLoginStatus = () => {
    const { user } = auth;
    if (user) {
      return (
        <>
          <Avatar size="small" className="mr-2" src={user.avatar} />
          <Link className="hover:underline text-white text-2xl" to="/workspace">
            {`${user.firstname} ${user.lastname}`} <IconArrowUpRight />
          </Link>
        </>
      );
    } else {
      return (
        <Link className="hover:underline text-white text-2xl" to="/login">
          {t("index.login")} <IconArrowUpRight />
        </Link>
      );
    }
  };
  return (
    <div className={`h-screen ${styles.index}`}>
      <div
        className={`${styles.header} p-4 fixed flex w-full items-center justify-between`}
      >
        <Title heading={1} style={{ color: "white" }}>
          Breeze
        </Title>
        <div className={`${styles.link} flex justify-center`}>{renderLoginStatus()}</div>
      </div>

      <main className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-[10vw]">
            {t("index.heroText.part1")}
          </div>
          <div className="font-bold text-4xl">{t("index.heroText.part2")}</div>
        </div>
        <div className={`mt-20 ${styles.path}`}>
          <div
            className={`${styles.ios} flex items-center justify-center p-2 text-white `}
          >
            <MaterialSymbolsAndroid className="mr-2 text-3xl" />
            <Title heading={5} style={{ color: "white" }}>
              iOS (developing)
            </Title>
          </div>
          <div
            className={`${styles.android} flex items-center justify-center p-2 text-white `}
          >
            <IcBaselineApple className="mr-2 text-3xl" />
            <Title heading={5} style={{ color: "white" }}>
              Android (developing)
            </Title>
          </div>
          <div
            className={`${styles.pwa}  flex items-center justify-center p-2 text-white `}
          >
            <SimpleIconsPwa className="mr-2 text-3xl" />
            <Title heading={5} style={{ color: "white" }}>
              PWA (developing)
            </Title>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
