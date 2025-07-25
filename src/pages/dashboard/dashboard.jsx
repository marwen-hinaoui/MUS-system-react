import { FONTSIZE } from "../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../components/searchComponent/searchComponent";
import CardComponent from "../../components/card/cardComponent";
import TableDashboard from "./components/tableDashboard/tableDashboard";
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
      <CardComponent className={"overflow-hidden"} padding={"0"} margin={"0"}>
        {/* <TableDashboard /> */}
        <TableDashboard />
      </CardComponent>
    </div>
  );
};

export default Dashboard;
