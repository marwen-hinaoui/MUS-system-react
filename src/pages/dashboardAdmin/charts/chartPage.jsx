import { Breadcrumb } from "antd/lib";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const ChartPage = () => {
  const navigate = useNavigate();
  const breadcrumb = [
    {
      title: <RiDashboardHorizontalLine />,
    },

    {
      title: <Link to={"/admin"}>Dashboard</Link>,
    },
    {
      title: "Statistics",
    },
  ];
  return (
    <div className="dashboard">
      <div style={{ paddingBottom: "17px" }}>
        <Breadcrumb items={breadcrumb} />
      </div>{" "}
    </div>
  );
};

export default ChartPage;
