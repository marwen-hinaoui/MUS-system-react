import { FONTSIZE } from "../../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../../components/searchComponent/searchComponent";
import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";
import { Spin, Statistic } from "antd/lib";
import { IoPeopleOutline } from "react-icons/io5";
import { COLORS } from "../../../constant/colors";

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
const DashboardAdmin = () => {
  return (
    <div className="dashboard pt-5 px-3 pe-3">
      <div className="d-flex justify-content-evenly">
        {/* <CardComponent padding={"55px"}> */}
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: COLORS.BLACK }}
            prefix={<IoPeopleOutline />}
            suffix="%"
          />
        {/* </CardComponent>
        <CardComponent padding={"55px"}> */}
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: COLORS.BLACK }}
            prefix={<IoPeopleOutline />}
            suffix="%"
          />
        {/* </CardComponent>
        <CardComponent padding={"55px"}> */}
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: COLORS.BLACK  }}
            prefix={<IoPeopleOutline />}
            suffix="%"
          />
        {/* </CardComponent>
        <CardComponent padding={"55px"}> */}
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: COLORS.BLACK }}
            prefix={<IoPeopleOutline />}
            suffix="%"
          />
        {/* </CardComponent> */}
      </div>
      <div className="d-flex justify-content-between align-items-center pt-5">
        

        <p
          style={{
            fontSize: FONTSIZE.TITLE,
            fontWeight: "500",
          }}
        >
          
        </p>
        <SearchComponent />
      </div>

      {responseDataDemande ? (
        <>
          <div className="py-2"></div>
          <TableDemandeReadWrite data={responseDataDemande} />
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default DashboardAdmin;
