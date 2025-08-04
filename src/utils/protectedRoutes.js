import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";

import { COLORS } from "../constant/colors";
import DashboardHeader from "../components/header/header";
import DashboardSidebarDemandeur from "../pages/dashboardDemandeur/components/sidebar/sidebar";
import DashboardSidebarAgent from "../pages/dashboardAgentStock/components/sidebar/sidebar";
import DashboardSidebarAdmin from "../pages/dashboardAdmin/components/sidebar/sidebar";
import { Navigate } from "react-router-dom";
import { Spin } from "antd/lib";

export const ProtectedRoutes = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const token = useSelector((state) => state.app.tokenValue);
  const role = useSelector((state) => state.app.role);
  const fullname = useSelector((state) => state.app.fullname);

  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [isAuthenticated]);

  if (fullname === null || isAuthenticated === null || role === null  ) {

    return (
      <div className="d-flex justify-content-center py-3">
        <Spin />
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (!allowedRoles.includes(role)) {

    return <Navigate to="/unauthorized" />;
  }

  if (role == "ROLE_AGENT_MUS") {
    return (
      <div className="d-flex">
        <DashboardSidebarAgent />
        <div
          style={{
            backgroundColor: COLORS.bgWHITE,
          }}
          className="d-flex flex-column w-100"
        >
          <DashboardHeader token={token}  role={"Agent stock"} fullname={fullname} />
          <div
            style={{
              marginTop: "63px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (role == "Admin") {
    return (
      <div className="d-flex">
        <DashboardSidebarAdmin />
        <div
          style={{
            backgroundColor: COLORS.bgWHITE,
          }}
          className="d-flex flex-column w-100"
        >
          <DashboardHeader token={token}  role={"Admin"} fullname={fullname} />
          <div
            style={{
              marginTop: "63px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (role == "ROLE_DEMANDEUR") {
    return (
      <div className="d-flex">
        <DashboardSidebarDemandeur />
        <div
          style={{
            backgroundColor: COLORS.bgWHITE,
          }}
          className="d-flex flex-column w-100"
        >
          <DashboardHeader token={token}  role={"Demandeur"} fullname={fullname} />
          <div
            style={{
              marginTop: "63px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
};
