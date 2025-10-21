import React, { useState, useMemo } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { COLORS } from "../../../../constant/colors";
import LearLogo from "../../../../assets/img/LearLogo1.png";
import { FONTSIZE, ICONSIZE } from "../../../../constant/FontSizes";

import { MdLibraryAdd, MdSpaceDashboard } from "react-icons/md";
import { IoLayers, IoReloadCircleSharp } from "react-icons/io5";

const { Sider } = Layout;
const commonNavItems = [
  {
    key: "demande",
    icon: <MdSpaceDashboard size={ICONSIZE.SMALL} />,
    label: "Suivi des demandes",
    route: "/user",
  },
];
const roleBasedNavItems = {
  demandeur: [
    {
      key: "cree_demande",
      icon: <MdLibraryAdd size={ICONSIZE.SMALL} />,
      label: "Nouvelle demande",
      route: "/user/cree_demande",
    },
  ],
  agent: [
    {
      key: "stock",
      icon: <IoLayers size={ICONSIZE.SMALL} />,
      label: "Gestion stock",
      route: "/user/stock",
    },
    {
      key: "rebuild",
      icon: <IoReloadCircleSharp size={ICONSIZE.SMALL} />,
      label: "Reconstruction Coiffe",
      route: "/user/rec",
    },
  ],
};

const UserSidebar = ({ roleList }) => {
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    let items = [...commonNavItems];
    if (roleList.includes("DEMANDEUR")) {
      items = [...items, ...roleBasedNavItems.demandeur];
    }
    if (
      roleList.includes("AGENT_MUS") ||
      roleList.includes("GESTIONNEUR_STOCK")
    ) {
      items = [...items, ...roleBasedNavItems.agent];
    }
    return items;
  }, [roleList]);

  const selectedKey = navItems
    .filter((item) => location.pathname.startsWith(item.route))
    .sort((a, b) => b.route.length - a.route.length)[0]?.key;

  const handleMenuClick = ({ key }) => {
    const item = navItems.find((item) => item.key === key);
    if (item && item.route) {
      navigate(item.route);
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

export default UserSidebar;
