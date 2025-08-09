import "./dashboard.css";

import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";

import CardComponent from "../../../components/card/cardComponent";
import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { AiOutlineCheckCircle, AiOutlineHistory } from "react-icons/ai";
import { COLORS } from "../../../constant/colors";
import { CloseCircleOutlined } from "@ant-design/icons";
import { SiDatabricks } from "react-icons/si";

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
    responseDataDemande && (
      <div className="dashboard">
        <div className="flex-container">
          <StatisticsComponent
            icon={<AiOutlineHistory />}
            title="En cours"
            valuePercent={60}
            chiffre={6}
            borderColor={COLORS.GREEN}
          />
          <StatisticsComponent
            icon={<CloseCircleOutlined />}
            title="Hors stock"
            valuePercent={80}
            chiffre={3}
            borderColor={COLORS.LearRed}
          />
          <StatisticsComponent
            icon={<AiOutlineCheckCircle />}
            title="Cloturé"
            valuePercent={65}
            chiffre={3}
            borderColor={COLORS.Warning}
          />
          <StatisticsComponent
            icon={<SiDatabricks />}
            title="Total"
            valuePercent={65}
            chiffre={3}
            borderColor={COLORS.Blue}
          />
        </div>

        <>
          <div style={{ padding: "17px 0 0 0" }}></div>
          <CardComponent>
            <h4 style={{ padding: "15px" }}>Total demande</h4>
            <TableDemandeReadWrite data={responseDataDemande} />
          </CardComponent>
        </>
      </div>
    )
  );
};

export default DashboardAdmin;
