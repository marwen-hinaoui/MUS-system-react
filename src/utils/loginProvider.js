import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";

export const LoginProvider = ({ children }) => {
  const token = useSelector((state) => state.app.tokenValue);
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [token, isAuthenticated]);

  return <>{children}</>;
};
