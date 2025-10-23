import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";
import { Spin } from "antd";

export const LoginProvider = ({ children }) => {
  const token = useSelector((state) => state.app.tokenValue);
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const isLoadingRefresh = useSelector((state) => state.app.isLoadingRefresh);
  const NetworkErrorMsg = useSelector((state) => state.app.NetworkErrorMsg);
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [token, isAuthenticated]);

  if (isLoadingRefresh) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <Spin size="small" />
      </div>
    );
  }
  if (NetworkErrorMsg.length > 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <h1>{NetworkErrorMsg}</h1>
      </div>
    );
  }
  return <>{children}</>;
};
