import "./dashboard.css";

import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";

import CardComponent from "../../../components/card/cardComponent";
import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { AiOutlineCheckCircle, AiOutlineHistory } from "react-icons/ai";
import { CloseCircleOutlined } from "@ant-design/icons";
import { SiDatabricks } from "react-icons/si";
import { Breadcrumb } from "antd/lib";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FONTSIZE } from "../../../constant/FontSizes";
import { useEffect, useState } from "react";
import { get_all_demande_api } from "../../../api/get_all_demande_api";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
} from "../../../redux/slices";

const breadcrumb = [
  {
    title: <RiDashboardHorizontalLine />,
  },

  {
    title: "Dashboard",
  },
];
const DashboardAdmin = () => {
  const [demandes, setDemande] = useState([]);
  const [total, setTotal] = useState(0);
  const token = useSelector((state) => state.app.tokenValue);
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(set_demande_data_table(demandes));
    dispatch(set_data_searching(demandes));
  }, [dispatch]);
  return (
    demandes && (
      <div className="dashboard">
        <div style={{ paddingBottom: "13px" }}>
          <Breadcrumb
            style={{ fontSize: FONTSIZE.PRIMARY }}
            items={breadcrumb}
          />
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
            <TableDemandeReadWrite data={demandes} />
          </CardComponent>
        </div>
      </div>
    )
  );
};

export default DashboardAdmin;
