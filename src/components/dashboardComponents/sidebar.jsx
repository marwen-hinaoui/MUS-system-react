import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  PlusSquareOutlined,
  ProfileFilled,
  SettingOutlined,
} from "@ant-design/icons";

import { COLORS } from "../../constant/colors";
import LearLogo from "../../assets/img/LearLogo.png";
import LearLogo1 from "../../assets/img/LearLogo1.png";
import { useSelector } from "react-redux";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import {
  MdOutlineAddBox,
  MdOutlinePerson,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { BsPerson, BsPersonFill } from "react-icons/bs";
const { Sider } = Layout;

const navItems = [
  {
    key: "dashboard",
    icon: <MdOutlineSpaceDashboard size={ICONSIZE.SMALL} />,
    label: "Dashboard",
  },
  {
    key: "cree_demande",
    icon: <MdOutlineAddBox size={ICONSIZE.SMALL} />,
    label: "Crée Demande",
  },

  {
    key: "profil",
    icon: <BsPerson size={ICONSIZE.SMALL} />,

    label: "Profil",
  },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [position, setPosition] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>
        {`
        .ant-layout-sider {
          background-color: ${COLORS.WHITE} !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.09);
          border-right: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ant-menu-light.ant-menu-inline-collapsed > .ant-menu-item,
        .ant-menu-light.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item,
        .ant-menu-light.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
          padding: 0 16px !important;
        }
        .ant-menu-light .ant-menu-item-selected {
          background-color: ${COLORS.LearRed} !important;
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item-selected .anticon {
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item-selected .ant-menu-title-content {
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item:hover {
          background-color: ${COLORS.LearRed} !important;
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item:hover .anticon {
          color: ${COLORS.WHITE} !important;
        }
        `}
      </style>
      <Sider
        collapsible
        collapsed={collapsedSidebar}
        onCollapse={setCollapsed}
        width={200}
        collapsedWidth={60}
        trigger={null}
        // onMouseEnter={() => {
        //   setCollapsed(false);
        //   // setPosition("fixed");
        // }}
        // onMouseLeave={() => {
        //   setCollapsed(true);
        //   // setPosition("sticky");
        // }}
        style={{
          overflow: "auto",
          height: "100vh",
          position: position,
          left: 0,
          top: 0,
        }}
      >
        <div
          className="logo"
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            paddingLeft: collapsed ? "0" : "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            color: COLORS.BLACK,
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {collapsedSidebar && (
            <img src={LearLogo1} style={{ width: "42px" }} />
          )}
          {!collapsedSidebar && (
            <img src={LearLogo} style={{ width: "150px" }} />
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activePage]}
          onClick={({ key }) => setActivePage(key)}
          items={navItems}
          style={{ borderRight: 0, fontSize: FONTSIZE.PRIMARY }}
        />
      </Sider>
    </Layout>
  );
};

export default DashboardSidebar;
