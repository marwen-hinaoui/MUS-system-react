import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import ClickingIcon from "../../components/clickingIcon/clickingIcon";
import "./header.css";

import { BsPerson } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";

const DashboardHeader  = ({role, fullname}) => {
  const logout = () => {
    alert();
  };
  return (
    <div style={{ backgroundColor: COLORS.WHITE }} className="header px-4">
      <div className="">
        <div className="d-flex">
          <div className="d-flex align-items-center">
            <BsPerson size={ICONSIZE.SMALL} />
            <p style={{ fontSize: FONTSIZE.PRIMARY }} className="ps-1 pe-3">
              {fullname ? fullname: ''}
            </p>
          </div>
          <p style={{ fontSize: FONTSIZE.PRIMARY }}>{role ? role :''}</p>
        </div>
      </div>

      <p
        onClick={() => {
          logout();
        }}
      >
        <ClickingIcon
          color={COLORS.LearRed}
          name={"Déconnexion"}
          icon={<IoLogOut color={COLORS.LearRed} size={ICONSIZE.SMALL} />}
        />
      </p>
    </div>
  );
};

export default DashboardHeader ;
