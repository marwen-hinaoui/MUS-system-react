import { FONTSIZE } from "../../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../../components/searchComponent/searchComponent";
import { Spin } from "antd/lib";
import TableDashboardReadOnly from "../../tableDemandeReadOnly/tableDemandeReadOnly";

const responseDataDemande = [
  {
    id: 1,
    numDemandeMUS: "MUS1234567",
    site: "Trim1", 
    projet: "MBEAM",
    sequence: "1624251117971",
    Qte_demande: 3,
    status: "Terminé",
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
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 3,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 1,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 4,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 5,
    numDemandeMUS: "MUS1234567",

    site: "Trim2",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 8,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 6,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 5,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 7,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    status: "Hors stock",
    date_creation: "28-12-2025",
  },
  {
    id: 8,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 9,
    numDemandeMUS: "MUS1234567",

    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    status: "Terminé",
    date_creation: "28-12-2025",
  },
  {
    id: 10,
    numDemandeMUS: "MUS1234567",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },
];
const DashboardDemandeur = () => {
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
          <TableDashboardReadOnly data={responseDataDemande} />
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default DashboardDemandeur;
