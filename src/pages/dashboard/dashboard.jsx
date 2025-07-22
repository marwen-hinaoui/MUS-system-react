import TableDashboard from "./components/tableDashboard";
import { FONTSIZE } from "../../constant/FontSizes";
import CardComponent from "../../components/card/cardComponent";
import "./dashboard.css";
import { Space } from "antd";
import { Input } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import SearchComponent from "../../components/searchComponent/searchComponent";
const Dashboard = () => {
  return (
    <div className="dashboard p-3">
      <CardComponent width={"100%"} padding={"10px"} margin={0}>
        <div className="d-flex justify-content-between align-items-center">
          <p
            style={{
              fontSize: FONTSIZE.TITLE,
              fontWeight: "500",
            }}
          >
            Tableau Demandes MUS
          </p>
            <SearchComponent />
          {/* <Space.Compact size="middle">
            <Input
              addonBefore={<MdSearch />}
              
            />
          </Space.Compact> */}
        </div>

        <div className="py-2"></div>
        <TableDashboard />
      </CardComponent>
    </div>
  );
};

export default Dashboard;
