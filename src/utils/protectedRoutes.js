import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshAccessToken } from "../api/shared/refresh";

import DashboardHeader from "../components/header/header";
import UserSidebar from "../pages/dashboardUser/components/sidebar/sidebar";
import DashboardSidebarAdmin from "../pages/dashboardAdmin/components/sidebar/sidebar";
import { Navigate } from "react-router-dom";
import { set_loading } from "../redux/slices";
import { COLORS } from "../constant/colors";
import { FONTSIZE } from "../constant/FontSizes";
import { Spin } from "antd";

const bgStyles = {
  backgroundColor: COLORS.BG,
};

export const ProtectedRoutes = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const isLoadingRefresh = useSelector((state) => state.app.isLoadingRefresh);
  const token = useSelector((state) => state.app.tokenValue);
  const roleList = useSelector((state) => state.app.roleList);
  const fullname = useSelector((state) => state.app.fullname);
  const dispatch = useDispatch();
  const refreshAccessToken = useRefreshAccessToken();

  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [isAuthenticated, token]);

  if (fullname === null || isAuthenticated === null || roleList === null) {
    dispatch(set_loading(true));
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  const hasAccess = roleList?.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" />;
  }

  if (
    roleList.includes("AGENT_MUS") ||
    roleList.includes("DEMANDEUR") ||
    roleList.includes("GESTIONNAIRE_STOCK")
  ) {
    return (
      <div className="d-flex">
        <UserSidebar roleList={roleList} />
        <div style={bgStyles} className="d-flex flex-column w-100">
          <DashboardHeader token={token} role={roleList} fullname={fullname} />
          <div style={{ marginTop: "63px" }}>{children}</div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              fontSize: FONTSIZE.PRIMARY,
            }}
          >
            V2.1
          </div>
        </div>
      </div>
    );
  }
  if (roleList.includes("Admin")) {
    return (
      <div className="d-flex">
        <DashboardSidebarAdmin />
        <div style={bgStyles} className="d-flex flex-column w-100">
          <DashboardHeader token={token} role={["Admin"]} fullname={fullname} />
          <div style={{ marginTop: "63px" }}>{children}</div>
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              fontSize: FONTSIZE.PRIMARY,
            }}
          >
            V2.1
          </div>
        </div>
      </div>
    );
  }
};
