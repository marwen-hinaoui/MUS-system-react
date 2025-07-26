import { FONTSIZE } from "../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../components/searchComponent/searchComponent";
import CardComponent from "../../components/card/cardComponent";
import TableDashboard from "./components/tableDashboard/tableDashboard";
import { Spin } from "antd/lib";

const responseDataDemande = [
  {
    id: 1,
    numDemandeMUS: "MUS1234567",
    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117971",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },

  {
    id: 2,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117933",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 3,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 4,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 5,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 6,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 7,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 8,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 9,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 10,
    numDemandeMUS: "MUS1234567",
    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
];
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
      {responseDataDemande ? (
        <>
          <div className="py-2"></div>
          <CardComponent
            className={"overflow-hidden"}
            padding={"0"}
            margin={"0"}
          >
            <TableDashboard data={responseDataDemande} />
          </CardComponent>
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default Dashboard;
