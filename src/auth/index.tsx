import { Notification } from "@douyinfe/semi-ui";
import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthService, UserDTO } from "../api";
import { OpenAPI } from "../api/core/OpenAPI";
export interface AuthContextType {
  user: any;
  signout: (callback: VoidFunction) => void;
  setCurrentUser: (user: UserDTO) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  const signout = useCallback((callback: VoidFunction) => {
    setUser(null);
    callback();
  }, []);
  const setCurrentUser = useCallback((user: UserDTO) => {
    setUser(user);
  }, []);

  let value = { user, signout, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  const navigate = useNavigate();
  let location = useLocation();
  const { user } = auth;
  const getCurrentUser = async () => {
    try {
      const currentUser = await AuthService.authControllerMe();
      auth.setCurrentUser(currentUser);
    } catch (error) {
      localStorage.removeItem("accessToken");
      OpenAPI.TOKEN = "";
      navigate("/login");
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
    } catch (error) {
      Notification.error({
        title: "登录失败",
        content: "请重试",
      });
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

  return children;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
