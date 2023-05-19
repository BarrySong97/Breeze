import { Button, Typography } from "@douyinfe/semi-ui";
import { FC } from "react";
import SignInImage from "../../assets/images/signin.jpg";
import styles from "./index.module.less";
import { Link } from "react-router-dom";
import { LogosGoogleIcon } from "../../assets/icons/Google";
import { TwemojiDashingAway } from "../../assets/icons/icon";
import { createGoogleLoginUrl } from "../../utils/auth";
import { useTranslation } from "react-i18next";
export interface LoginProps {}
const { Title, Text } = Typography;
const Login: FC<LoginProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="h-screen flex relative">
      <div className="absolute left-6 top-4 ">
        <Link to={"/"}>
          <Title heading={2} type="secondary" strong>
            Breeze
          </Title>
          <Text type="tertiary" strong>
            {t("login.slogan")}
          </Text>
        </Link>
      </div>
      <div className="w-1/3">
        <img
          src={SignInImage}
          alt="Picture of the author"
          className="object-cover"
          style={{ height: "100%" }}
          // width={500} automatically provided
          // height={500} automatically provided
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
        />
      </div>
      <div className="w-2/3  flex flex-col justify-center items-center">
        <div
          // title="Breeze"
          className={styles.card}
          style={{
            width: 400,
          }}
        >
          {/* <Meta title={} /> */}
          <Title heading={2} type="primary" strong>
            <div className="flex items-center">
              <TwemojiDashingAway className="mr-2" />
              Breeze
            </div>
          </Title>
          <div className="flex flex-col justify-center items-center">
            <div
              style={{
                height: 150,
              }}
              className="flex flex-col justify-center items-center"
            >
              <Title heading={3} type="primary" strong>
                {t("login.box.login")}
              </Title>
              <div className="mb-1"></div>
              <Text type="secondary" strong>
                {t("login.box.slogan")}
              </Text>
            </div>
            <Button
              className="w-full"
              icon={<LogosGoogleIcon />}
              type="primary"
              theme="solid"
              onClick={() => {
                createGoogleLoginUrl();
              }}
            >
              {t("login.box.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
