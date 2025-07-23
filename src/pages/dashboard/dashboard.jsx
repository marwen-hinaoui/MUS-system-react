import TableDashboard from "./components/tableDashboard";
import { FONTSIZE } from "../../constant/FontSizes";
import CardComponent from "../../components/card/cardComponent";
import "./dashboard.css";

import SearchComponent from "../../components/searchComponent/searchComponent";
import TableDashboard2 from "./components/tableDashboard2";
const Dashboard = () => {
  return (
    <div className="dashboard p-3">
      {/* <CardComponent width={"100%"} padding={"10px"} margin={0}> */}
        <div className="d-flex justify-content-between align-items-center">
          <p
            style={{
              fontSize: FONTSIZE.TITLE,
              fontWeight: "500",
            }}
          >
            {/* Tableau Demandes MUS */}
          </p>
          <SearchComponent />
        </div>

        <div className="py-2"></div>
        {/* <TableDashboard /> */}
        <TableDashboard2/>
      {/* </CardComponent> */}
    </div>
  );
};

export default Dashboard;
