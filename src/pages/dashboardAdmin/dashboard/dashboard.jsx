import { FONTSIZE } from "../../../constant/FontSizes";
import "./dashboard.css";

import SearchComponent from "../../../components/searchComponent/searchComponent";
import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";
import { Spin } from "antd/lib";

import CardComponent from "../../../components/card/cardComponent";
import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { COLORS } from "../../../constant/colors";
import { PiClockClockwiseBold } from "react-icons/pi";
import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { IoIosList } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const responseDataDemande = [
  {
    id: 1,
    numDemandeMUS: "MUS1234567",
    site: "Brown field",
    projet: "AYGO",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },

  {
    id: 2,
    numDemandeMUS: "MUS1234567",

    site: "Brown field",
    projet: "AYGO",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 3,
    numDemandeMUS: "MUS1234567",

    site: "Brown field",
    projet: "AYGO",
    part_number: "L162425111GABC",
    Qte_demande: 1,
    status: "Hors stock",
    date_creation: "28-12-2025",
  },
  {
    id: 4,
    numDemandeMUS: "MUS1234567",

    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 5,
    numDemandeMUS: "MUS1234567",

    site: "Brown field",
    projet: "AYGO",
    part_number: "L162425111GABC",
    Qte_demande: 8,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 6,
    numDemandeMUS: "MUS1234567",

    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 5,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 7,
    numDemandeMUS: "MUS1234567",

    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "Hors stock",
    date_creation: "28-12-2025",
  },
  {
    id: 8,
    numDemandeMUS: "MUS1234567",

    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 9,
    numDemandeMUS: "MUS1234567",

    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "Cloturé",
    date_creation: "28-12-2025",
  },
  {
    id: 10,
    numDemandeMUS: "MUS1234567",
    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },
];
const DashboardAdmin = () => {
  return (
    <div className="dashboard pt-5 px-3 pe-3">
      {" "}
      <div className="flex-container">
        
        <StatisticsComponent
          icon={<PiClockClockwiseBold />}
          title="En cours"
          valuePercent={60}
          chiffre={6}
          borderColor={COLORS.GREEN}
          tooltip="Les demande en cours"
        />
        <StatisticsComponent
          icon={<CloseCircleOutlined />}
          title="Hors stock"
          valuePercent={80}
          chiffre={3}
          borderColor={COLORS.LearRed}
          tooltip="Les demande hors stock"
        />
        <StatisticsComponent
          icon={<AiOutlineCheckCircle />}
          title="Cloturé"
          valuePercent={65}
          chiffre={3}
          borderColor={COLORS.Warning}
          tooltip="Les demande cloturé"
        />
  
      </div>
      <div className="d-flex justify-content-between align-items-center pt-5">
        <SearchComponent />
        <p
          style={{
            fontSize: FONTSIZE.TITLE,
            fontWeight: "500",
          }}
        ></p>
      </div>
      {responseDataDemande ? (
        <>
          <div className="py-2"></div>
          <CardComponent>
            <TableDemandeReadWrite data={responseDataDemande} />
          </CardComponent>
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default DashboardAdmin;
