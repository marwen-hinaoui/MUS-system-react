import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import ClickingIcon from "../clickingIcon/clickingIcon";
import "./header.css";
import CI_LOGO from "../../assets/img/CI_Logo.png";
import CI_TEXT from "../../assets/img/ci_text.png";

import { IoLogOut } from "react-icons/io5";
import { logout_api } from "../../api/logout_api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  set_authenticated,
  set_fullname,
  set_redirection,
  set_role,
  set_token,
} from "../../redux/slices";
import { useState } from "react";

const DashboardHeader = ({ role, fullname, token }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fonction = useSelector((state) => state.app.fonction);
  const site = useSelector((state) => state.app.site);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    const res = await logout_api(token);
    if (res.resData) {
      dispatch(set_redirection("/"));
      navigate("/");
      dispatch(set_role(null));
      dispatch(set_token(null));
      dispatch(set_fullname(null));
      dispatch(set_authenticated(false));
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{ backgroundColor: COLORS.WHITE }}
      className="header px-3 d-flex justify-content-between align-items-center"
    >
      {/* User info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={CI_LOGO} height={40} />
        <div style={{ paddingLeft: "5px" }}></div>
        {/* <img src={CI_TEXT} /> */}
        <div
          style={{
            display: "flex",
            lineHeight: "11px",
            flexDirection: "column",
          }}
        >
          <b style={{ fontSize: "11px", letterSpacing: "2px" }}>CONTINUOUS </b>
          <b style={{ fontSize: "11px", letterSpacing: "2px" }}>IMPROVEMENT</b>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div
          style={{ paddingRight: "20px" }}
          className="user-info position-relative d-flex align-items-center"
        >
          <p style={{ fontSize: FONTSIZE.PRIMARY }}>{fullname || ""}</p>
          <p style={{ fontSize: FONTSIZE.PRIMARY, paddingLeft: "15px" }}>
            {fonction}
          </p>
          <p style={{ fontSize: FONTSIZE.PRIMARY, paddingLeft: "15px" }}>
            {site}
          </p>
        </div>

        {/* Déconnexion */}
        <p onClick={logout}>
          <ClickingIcon
            isLoading={isLoading}
            color={COLORS.LearRed}
            name={"Déconnexion"}
            icon={<IoLogOut color={COLORS.LearRed} size={ICONSIZE.SMALL} />}
          />
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
