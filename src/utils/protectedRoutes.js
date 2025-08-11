import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";

import DashboardHeader from "../components/header/header";
import DashboardSidebarDemandeur from "../pages/dashboardDemandeur/components/sidebar/sidebar";
import DashboardSidebarAgent from "../pages/dashboardAgentStock/components/sidebar/sidebar";
import DashboardSidebarAdmin from "../pages/dashboardAdmin/components/sidebar/sidebar";
import { Navigate } from "react-router-dom";
import { set_loading } from "../redux/slices";
import { COLORS } from "../constant/colors";

const bgStyles = {
  backgroundColor: COLORS.BG,
};
export const ProtectedRoutes = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const token = useSelector((state) => state.app.tokenValue);
  const role = useSelector((state) => state.app.role);
  const fullname = useSelector((state) => state.app.fullname);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [isAuthenticated, token]);

  if (fullname === null || isAuthenticated === null || role === null) {
    dispatch(set_loading(true));
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (role === "AGENT_MUS") {
    return (
      <div className="d-flex">
        <DashboardSidebarAgent />
        <div style={bgStyles} className="d-flex flex-column w-100">
          <DashboardHeader
            token={token}
            role={"Agent stock"}
            fullname={fullname}
          />
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
  if (role === "Admin") {
    return (
      <div className="d-flex">
        <DashboardSidebarAdmin />
        <div style={bgStyles} className="d-flex flex-column w-100">
          <DashboardHeader token={token} role={"Admin"} fullname={fullname} />
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
  if (role === "DEMANDEUR") {
    return (
      <div className="d-flex">
        <DashboardSidebarDemandeur />
        <div style={bgStyles} className="d-flex flex-column w-100">
          <DashboardHeader
            token={token}
            role={"Demandeur"}
            fullname={fullname}
          />
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
