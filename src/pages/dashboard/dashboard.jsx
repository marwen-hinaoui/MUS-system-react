import { FONTSIZE } from "../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../components/searchComponent/searchComponent";
import TableDashboard2 from "./components/tableDashboard/tableDashboard2";
import CardComponent from "../../components/card/cardComponent";
const Dashboard = () => {
  return (
    <div className="dashboard p-3">
      <div className="d-flex justify-content-between align-items-center">
        <SearchComponent />

        <p
          style={{
            fontSize: FONTSIZE.TITLE,
            fontWeight: "500",
          }}
        >
          {/* Tableau Demandes MUS */}
        </p>
      </div>

      <div className="py-2"></div>
      <CardComponent width={"100%"} padding={"0"} margin={0}>
        {/* <TableDashboard /> */}
        <TableDashboard2 />
      </CardComponent>
    </div>
  );
};

export default Dashboard;
