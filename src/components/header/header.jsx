import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import ClickingIcon from "../clickingIcon/clickingIcon";
import "./header.css";

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
      className="header px-4 d-flex justify-content-between align-items-center"
    >
      {/* User info */}
      <div className="user-info position-relative d-flex align-items-center">
        <p style={{ fontSize: FONTSIZE.PRIMARY }}>{fullname || ""}</p>
        <p style={{ fontSize: FONTSIZE.PRIMARY, paddingLeft: "15px" }}>
          {fonction}
        </p>

        {/* Dropdown with roles */}
        {/* {role && role.length > 0 && (
          <div className="role-dropdown position-absolute">
            {role?.map((r) => (
              <div key={r} className="role-item">
                {roleLabels[r] || r}
              </div>
            ))}
          </div>
        )} */}
      </div>

      {/* Logout */}
      <p onClick={logout}>
        <ClickingIcon
          isLoading={isLoading}
          color={COLORS.LearRed}
          name={"Déconnexion"}
          icon={<IoLogOut color={COLORS.LearRed} size={ICONSIZE.SMALL} />}
        />
      </p>
    </div>
  );
};

export default DashboardHeader;
