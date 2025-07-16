import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";
import DashboardHeader from "../components/dashboardComponents/header";
import DashboardSidebar from "../components/dashboardComponents/sidebar";

export const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const token = useSelector((state) => state.app.tokenValue);

  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [isAuthenticated]);

  return !isAuthenticated ? (
    <div className="d-flex">
      <DashboardSidebar />
      <div className="d-flex flex-column w-100">
        <DashboardHeader />
        <div>{children}</div>
      </div>
    </div>
  ) : null;
};
