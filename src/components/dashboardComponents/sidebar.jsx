import { Divider, Menu, Switch } from "antd";
const items = [
  {
    key: "1",
    // icon: <MailOutlined />,
    label: "Navigation One",
  },
  {
    key: "2",
    // icon: <CalendarOutlined />,
    label: "Navigation Two",
  },
];
const DashboardSidebar = () => {
  return (
    <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}

      items={items}
    />
  );
};
export default DashboardSidebar;
