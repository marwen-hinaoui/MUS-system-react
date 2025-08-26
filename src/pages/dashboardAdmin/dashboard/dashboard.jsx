import "./dashboard.css";

import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";

import CardComponent from "../../../components/card/cardComponent";
import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { Breadcrumb } from "antd/lib";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FONTSIZE, ICONSIZE } from "../../../constant/FontSizes";
import { useEffect, useState } from "react";
import { get_all_demande_api } from "../../../api/get_all_demande_api";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_loading,
} from "../../../redux/slices";
import LoadingComponent from "../../../components/loadingComponent/loadingComponent";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RxCheckCircled } from "react-icons/rx";
import { TbHistory } from "react-icons/tb";
import { LuLayers } from "react-icons/lu";

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
  const isLoading = useSelector((state) => state.app.isLoading);
  const [enCours, setEnCours] = useState(0);
  const [horsStock, setHorsStock] = useState(0);
  const [cloture, setCloture] = useState(0);
  const get_all_demande = async () => {
    dispatch(set_loading(true));
    const resDemandes = await get_all_demande_api(token);
    setDemande(resDemandes.resData.data);
    setTotal(resDemandes.resData.data.length);
    setEnCours(
      resDemandes.resData.data.filter((d) => d.statusDemande === "En cours")
        .length
    );
    setHorsStock(
      resDemandes.resData.data.filter((d) => d.statusDemande === "Hors stock")
        .length
    );
    setCloture(
      resDemandes.resData.data.filter((d) => d.statusDemande === "Cloturé")
        .length
    );
    dispatch(set_loading(false));
  };

  useEffect(() => {
    dispatch(set_demande_data_table(demandes));
    dispatch(set_data_searching(demandes));
    get_all_demande();
  }, [dispatch]);

  if (demandes.length === 0) {
    return <LoadingComponent header={true} />;
  }

  return (
    demandes && (
      <div className="dashboard">
        <div style={{ paddingBottom: "13px" }}>
          <Breadcrumb
            style={{ fontSize: FONTSIZE.XPRIMARY }}
            items={breadcrumb}
          />
        </div>

        <div className="flex-container">
           <StatisticsComponent
            icon={<LuLayers strokeWidth={1.7} size={ICONSIZE.XLARGE + 2} />}
            status="Total"
            chiffre={total}
            total={total}
          />
          <StatisticsComponent
            icon={<TbHistory strokeWidth={1.7} size={ICONSIZE.XLARGE + 2} />}
            status="En cours"
            valuePercent={((enCours / total) * 100).toFixed(0)}
            chiffre={enCours}
            total={total}
          />
          <StatisticsComponent
            icon={<IoCloseCircleOutline size={ICONSIZE.XLARGE + 2} />}
            status="Hors stock"
            valuePercent={((horsStock / total) * 100).toFixed(0)}
            chiffre={horsStock}
            total={total}
          />
          <StatisticsComponent
            icon={<RxCheckCircled size={ICONSIZE.XLARGE + 2} />}
            status="Livré"
            valuePercent={((cloture / total) * 100).toFixed(0)}
            chiffre={cloture}
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
