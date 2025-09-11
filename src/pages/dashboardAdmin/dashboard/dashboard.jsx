import "./dashboard.css";

import TableDemandeReadWrite from "../../tableDemandeReadWrite/tableDemandeReadWrite";

import StatisticsComponent from "../../../components/statistics/statisticsComponent";
import { FONTSIZE, ICONSIZE } from "../../../constant/FontSizes";
import { useEffect, useState } from "react";
import { get_all_demande_api } from "../../../api/get_all_demande_api";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_loading,
} from "../../../redux/slices";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RxCheckCircled } from "react-icons/rx";
import { TbHistory } from "react-icons/tb";
import { LuLayers } from "react-icons/lu";
import { Button } from "antd";

const Dashboard = () => {
  const [demandes, setDemande] = useState([]);
  const [total, setTotal] = useState(0);
  const token = useSelector((state) => state.app.tokenValue);
  const dispatch = useDispatch();
  const [enCours, setEnCours] = useState(0);
  const [horsStock, setHorsStock] = useState(0);
  const [livree, setLivree] = useState(0);
  const [initie, setInitie] = useState(0);
  const get_all_demande = async () => {
    dispatch(set_loading(true));
    const resDemandes = await get_all_demande_api(token);
    if (resDemandes.resData) {
      setDemande(resDemandes.resData.data);
      setTotal(resDemandes.resData.data.length);
      setEnCours(
        resDemandes.resData.data.filter(
          (d) => d.statusDemande === "Préparation en cours"
        ).length
      );
      setHorsStock(
        resDemandes.resData.data.filter((d) => d.statusDemande === "Hors stock")
          .length
      );
      setInitie(
        resDemandes.resData.data.filter(
          (d) => d.statusDemande === "Demande initié"
        ).length
      );
      setLivree(
        resDemandes.resData.data.filter(
          (d) =>
            d.statusDemande === "Demande livrée" ||
            d.statusDemande === "Demande partiellement livrée"
        ).length
      );
    } else {
      console.log(resDemandes.resError);
    }

    dispatch(set_loading(false));
  };

  useEffect(() => {
    dispatch(set_demande_data_table(demandes));
    dispatch(set_data_searching(demandes));
    get_all_demande();
  }, [dispatch]);

  return (
    demandes && (
      <div className="dashboard">
        {/* <div style={{ paddingBottom: "10px" }}> */}
        {/* <h4 style={{ margin: "0px" }}>Suivi des demandes</h4> */}
        {/* <p style={{ margin: "0px", color: COLORS.Gray4 }}>message</p> */}
        {/* </div> */}
        <div className="flex-container">
          <StatisticsComponent
            icon={<LuLayers strokeWidth={1.7} size={ICONSIZE.XLARGE} />}
            status="Total"
            chiffre={total}
            total={total}
          />
          <StatisticsComponent
            icon={<TbHistory strokeWidth={1.7} size={ICONSIZE.XLARGE} />}
            status="Préparation en cours"
            valuePercent={((enCours / total) * 100).toFixed(0)}
            chiffre={enCours}
            total={total}
          />
          <StatisticsComponent
            icon={<IoCloseCircleOutline size={ICONSIZE.XLARGE} />}
            status="Hors stock"
            valuePercent={((horsStock / total) * 100).toFixed(0)}
            chiffre={horsStock}
            total={total}
          />
          <StatisticsComponent
            icon={<RxCheckCircled size={ICONSIZE.XLARGE} />}
            status="Demande livrée"
            valuePercent={((livree / enCours + initie) * 100).toFixed(0)}
            chiffre={livree}
            total={enCours + initie}
          />
        </div>
        <div style={{ padding: "17px 0 0 0" }}>
          <TableDemandeReadWrite data={demandes} />
        </div>
      </div>
    )
  );
};

export default Dashboard;
