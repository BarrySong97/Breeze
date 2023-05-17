import { Notification, Spin, Typography } from "@douyinfe/semi-ui";
import { useBoolean } from "ahooks";
import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthService, UserDTO } from "../api";
import { OpenAPI } from "../api/core/OpenAPI";
import { TwemojiDashingAway } from "../assets/icons/icon";
const { Text } = Typography;
export interface AuthContextType {
  user: UserDTO | null;
  signout: (callback?: VoidFunction) => void;
  setCurrentUser: (user: UserDTO) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<UserDTO | null>(null);
  const navigate = useNavigate();

  const signout = useCallback((callback?: VoidFunction) => {
    setUser(null);
    window.localStorage.removeItem("accessToken");
    callback?.();
    navigate("/login");
  }, []);
  const setCurrentUser = useCallback((user: UserDTO) => {
    setUser(user);
  }, []);

  let value = { user, signout, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function AuthLoading({
  children,
  loading,
}: {
  children: JSX.Element;
  loading: boolean;
}) {
  console.log(loading);

  return loading ? (
    <div className="h-screen flex justify-center items-center ">
      <div className="card flex items-center flex-col justify-center">
        <div className="mb-2 text-3xl">
          <TwemojiDashingAway />
        </div>
        <div className="ml-2 flex  items-center">
          <Spin wrapperClassName="mr-2" />
          <Text type="primary" strong>
            Authenticating...
          </Text>
        </div>
      </div>
    </div>
  ) : (
    children
  );
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  const navigate = useNavigate();
  let location = useLocation();
  const [
    authLoading,
    { setTrue: setAuthLoadingTrue, setFalse: setAuthLoadingFalse },
  ] = useBoolean(true);
  const { user } = auth;
  const getCurrentUser = async () => {
    try {
      if (!authLoading) {
        setAuthLoadingTrue();
      }
      const currentUser = await AuthService.authControllerMe();
      auth.setCurrentUser(currentUser);
    } catch (error) {
      localStorage.removeItem("accessToken");
      OpenAPI.TOKEN = "";
      navigate("/login");
    } finally {
      setAuthLoadingFalse();
    }
  };
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");
  const googleLogin = async () => {
    if (!code) return;
    try {
      const response = await AuthService.authControllerGoogleLogin(code);
      const { accessToken, user } = response;
      OpenAPI.TOKEN = accessToken;
      auth.setCurrentUser(user);
      window.localStorage.setItem("accessToken", accessToken);
      navigate("/workspace");
    } catch (error) {
      window.localStorage.removeItem("accessToken");
      navigate("/login");
      Notification.error({
        title: "登录失败",
        content: "请重试",
      });
    } finally {
      setAuthLoadingFalse();
    }
  };
  useEffect(() => {
    if (!user) {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        // OpenAPI.TOKEN = accessToken;
        getCurrentUser();
      } else {
        if (code) {
          googleLogin();
        } else {
          navigate("/login");
        }
      }
    }
  }, []);

  return <AuthLoading loading={authLoading}>{children}</AuthLoading>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
