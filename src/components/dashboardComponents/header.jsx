import { COLORS } from "../../constant/colors";
import { AiOutlineMenu, AiOutlineUser } from "react-icons/ai";

import "./dashboardComponents.css";
import { useDispatch, useSelector } from "react-redux";
import { set_collapsedSidebar } from "../../redux/slices";
import { Link } from "react-router-dom";
import ButtonHeader from "../button/buttonHeader/buttonHeader";
import { BsPersonCircle } from "react-icons/bs";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { IoLogOut, IoLogOutOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
const DashboardHeader = () => {
  const dispatch = useDispatch();
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);
  return (
    <div style={{ backgroundColor: COLORS.WHITE }} className="header p-2">
      <AiOutlineMenu
        className="menu"
        onClick={() => {
          dispatch(set_collapsedSidebar(!collapsedSidebar));
        }}
        size={20}
      />
      <div className="d-flex">
        <div className="d-flex align-items-center">
          

          <ButtonHeader icon={<AiOutlineUser size={ICONSIZE.SMALL } />} content={"Full name"} />
        </div>
        <ButtonHeader content={"Role"} />
      </div>
    </div>
  );
};

export default DashboardHeader;
