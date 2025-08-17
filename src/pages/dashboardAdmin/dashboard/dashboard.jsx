import "./dashboard.css";

import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";

import CardComponent from "../../../components/card/cardComponent";
import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { AiOutlineCheckCircle, AiOutlineHistory } from "react-icons/ai";
import { CloseCircleOutlined } from "@ant-design/icons";
import { SiDatabricks } from "react-icons/si";
import { Breadcrumb } from "antd/lib";
import { RiDashboardHorizontalLine } from "react-icons/ri";

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
  {
    id: 11,
    numDemandeMUS: "MUS1234567",
    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },
  {
    id: 12,
    numDemandeMUS: "MUS1234567",
    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },
  {
    id: 13,
    numDemandeMUS: "MUS1234567",
    site: "Green field",
    projet: "MBEAM",
    part_number: "L162425111GABC",
    Qte_demande: 3,
    status: "En cours",
    date_creation: "28-12-2025",
  },
];
const total = responseDataDemande.length;
const breadcrumb = [
  {
    title: <RiDashboardHorizontalLine />,
  },

  {
    title: "Dashboard",
  },
];
const DashboardAdmin = () => {
  return (
    responseDataDemande && (
      <div className="dashboard">
        <div style={{ paddingBottom: "17px" }}>
          <Breadcrumb items={breadcrumb} />
        </div>

        <div className="flex-container">
          <StatisticsComponent
            icon={<AiOutlineHistory />}
            status="En cours"
            valuePercent={(6 / total) * 100}
            chiffre={6}
            total={total}
          />
          <StatisticsComponent
            icon={<CloseCircleOutlined />}
            status="Hors stock"
            valuePercent={(2 / total) * 100}
            chiffre={2}
            total={total}
          />
          <StatisticsComponent
            icon={<AiOutlineCheckCircle />}
            status="Cloturé"
            valuePercent={(3 / total) * 100}
            chiffre={3}
            total={total}
          />
          <StatisticsComponent
            icon={<SiDatabricks />}
            status="Total"
            chiffre={total}
            total={total}
          />
        </div>

        <div style={{ padding: "17px 0 0 0" }}>
          <CardComponent>
            <TableDemandeReadWrite data={responseDataDemande} />
          </CardComponent>
        </div>
      </div>
    )
  );
};

export default DashboardAdmin;
