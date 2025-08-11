import { Breadcrumb } from "antd/lib";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const ChartPage = () => {
  const navigate = useNavigate();
  const breadcrumb = [
    {
      title: <MdOutlineSpaceDashboard />,
    },

    {
      title: <Link to={"/admin"}>Demande</Link>,
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
