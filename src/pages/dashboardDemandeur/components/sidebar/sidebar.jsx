import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { COLORS } from "../../../../constant/colors";
import LearLogo from "../../../../assets/img/LearLogo1.png";
import { useSelector } from "react-redux";
import { FONTSIZE, ICONSIZE } from "../../../../constant/FontSizes";
import { BsPerson } from "react-icons/bs";
import { PiGridNine, PiStackPlus } from "react-icons/pi";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { MdOutlineLibraryAdd } from "react-icons/md";

const { Sider } = Layout;

const navItems = [
  {
    key: "cree_demande",
    icon: <MdOutlineLibraryAdd size={ICONSIZE.SMALL} />,
    label: "Création demande",
    route: "/demandeur/cree_demande",
  },
  {
    key: "demande",
    icon: <RiDashboardHorizontalLine size={ICONSIZE.SMALL} />,
    label: "Demande",
    route: "/demandeur",
  },
];

const DashboardSidebarDemandeur = () => {
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("cree_demande");

  const selectedKey = navItems
    .filter((item) => location.pathname.startsWith(item.route))
    .sort((a, b) => b.route.length - a.route.length)[0]?.key;

  const handleMenuClick = ({ key }) => {
    const item = navItems.find((item) => item.key === key);
    if (item && item.route) {
      navigate(item.route);
      setActivePage(key);
    }
  };
  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <a
        href={item.route}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          navigate(item.route);
        }}
        style={{ color: COLORS.WHITE, textDecoration: "none" }}
      >
        {item.label}
      </a>
    ),
  }));
  return (
    <Sider
      collapsible
      collapsed={collapsedSidebar}
      width={200}
      collapsedWidth={60}
      trigger={null}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflow: "auto",
        zIndex: 999,
        backgroundColor: COLORS.WHITE,
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        borderRight: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsedSidebar ? "center" : "flex-start",
          paddingLeft: collapsedSidebar ? 0 : 16,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <img src={LearLogo} alt="Logo" style={{ width: 40 }} />
      </div>

      <Menu
        theme="light"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={menuItems}
        style={{ borderRight: 0, fontSize: FONTSIZE.PRIMARY }}
      />

      <style>{`
              .ant-menu-item {
                border-radius: 4px !important;
              }
              .ant-menu-light .ant-menu-item-selected,
              .ant-menu-light .ant-menu-item:hover {
                background-color: ${COLORS.LearRed} !important;
                color: ${COLORS.WHITE} !important;
              }
              .ant-menu-light .ant-menu-item:hover .anticon {
                color: ${COLORS.WHITE} !important;
              }
            `}</style>
    </Sider>
  );
};

export default DashboardSidebarDemandeur;
