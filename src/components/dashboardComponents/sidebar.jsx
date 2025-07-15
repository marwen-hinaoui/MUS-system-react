import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  PlusSquareOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  TruckOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { COLORS } from "../../constant/colors";
import LearLogo from "../../assets/img/LearLogo.png";
import LearLogo1 from "../../assets/img/LearLogo1.png";
const { Sider } = Layout;

const navItems = [
  { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  {
    key: "create-request",
    icon: <PlusSquareOutlined />,
    label: "Create Request",
  },
  {
    key: "manage-requests",
    icon: <UnorderedListOutlined />,
    label: "Manage Requests",
  },
  {
    key: "approve-requests",
    icon: <CheckSquareOutlined />,
    label: "Approve Requests",
  },
  { key: "pls-request", icon: <TruckOutlined />, label: "PLS Request" },
  { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

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
          background-color: #FFCDD2 !important;
          color: ${COLORS.LearRedDark} !important;
        }
        .ant-menu-light .ant-menu-item-selected .anticon {
          color: ${COLORS.LearRedDark} !important;
        }
        .ant-menu-light .ant-menu-item-selected .ant-menu-title-content {
          color: ${COLORS.LearRedDark} !important;
        }
        .ant-menu-light .ant-menu-item:hover {
          background-color: #FFCDD2 !important;
          color: ${COLORS.LearRedDark} !important;
        }
        .ant-menu-light .ant-menu-item:hover .anticon {
          color: ${COLORS.LearRedDark} !important;
        }
        `}
      </style>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        collapsedWidth={60}
        trigger={null}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
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
          {collapsed && (
            <img
              src={LearLogo1}
              alt="Lear Corp."
              style={{ width: "40px",  }}
            />
          )}
          {!collapsed && (
            <img
              src={LearLogo}
              alt="Lear Corp."
              style={{ width: "150px" }}
            />
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activePage]}
          onClick={({ key }) => setActivePage(key)}
          items={navItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
    </Layout>
  );
};

export default DashboardSidebar;
