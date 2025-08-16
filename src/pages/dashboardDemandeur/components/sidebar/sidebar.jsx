import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { COLORS } from "../../../../constant/colors";
import LearLogo from "../../../../assets/img/LearLogo1.png";
import { useSelector } from "react-redux";
import { FONTSIZE, ICONSIZE } from "../../../../constant/FontSizes";
import { BsPerson } from "react-icons/bs";
import { PiGridNine, PiStackPlus } from "react-icons/pi";

const { Sider } = Layout;

const navItems = [
  {
    key: "cree_demande",
    icon: <PiStackPlus size={ICONSIZE.SMALL} />,
    label: "Creation demande",
    route: "/demandeur/cree_demande",
  },
  {
    key: "demande",
    icon: <PiGridNine size={ICONSIZE.SMALL} />,
    label: "Demande",
    route: "/demandeur",
  },
  {
    key: "profil",
    icon: <BsPerson size={ICONSIZE.SMALL} />,
    label: "Profil",
    route: "/demandeur/profil",
  },
];

const DashboardSidebarDemandeur = () => {
  const [collapsed, setCollapsed] = useState(true);
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("cree_demande");

  const selectedKey = navItems.find(
    (item) => location.pathname === item.route
  )?.key;

  const handleMenuClick = ({ key }) => {
    const item = navItems.find((item) => item.key === key);
    if (item && item.route) {
      navigate(item.route);
      setActivePage(key);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .ant-layout-sider {
          background-color: ${COLORS.WHITE} !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
          border-right: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ant-menu-light .ant-menu-item-selected {
          background-color: ${COLORS.LearRed} !important;
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item:hover {
          background-color: ${COLORS.LearRed} !important;
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item:hover .anticon {
          color: ${COLORS.WHITE} !important;
        }
      `}</style>

      <Sider
        collapsible
        collapsed={collapsedSidebar}
        onCollapse={setCollapsed}
        width={200}
        collapsedWidth={60}
        trigger={null}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          zIndex: 999,
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
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          <img src={LearLogo} style={{ width: "40px" }} />
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={navItems}
          style={{ borderRight: 0, fontSize: FONTSIZE.PRIMARY }}
        />
      </Sider>
    </Layout>
  );
};

export default DashboardSidebarDemandeur;
