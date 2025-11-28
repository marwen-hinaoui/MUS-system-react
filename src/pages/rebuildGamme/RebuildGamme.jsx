import { Button, Segmented } from "antd";
import { useEffect, useState } from "react";
import { GammeTaux } from "../../components/gammeTaux/gammeTaux";
import { GammeQte } from "../../components/gammeQte/gammeQte";
import { rebuild_api } from "../../api/rebuild_api";
import { set_data_searching, set_loading } from "../../redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { ICONSIZE } from "../../constant/FontSizes";
import { TbRefresh } from "react-icons/tb";
import CardComponent from "../../components/card/cardComponent";
import SearchComponent from "../../components/searchComponent/searchComponent";
const options = ["Gestion Coiffes (Qte)", "Gestion Coiffes (%)"];

const RebuildGamme = () => {
  const [currentView, setCurrentView] = useState("Gestion Coiffes (Qte)");
  const [rebuildData, setRebuildData] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.tokenValue);

  useEffect(() => {
    fetchRebuild(currentView);
  }, [dispatch]);

  const fetchRebuild = async (value) => {
    dispatch(set_loading(true));

    const res = await rebuild_api(token);
    if (value === "Gestion Coiffes (Qte)") {
      setRebuildData(res?.resData?.compeletedDataRebuild);
      dispatch(set_data_searching(res?.resData?.compeletedDataRebuild));
    }
    if (value === "Gestion Coiffes (%)") {
      setRebuildData(res?.resData?.data);
      dispatch(set_data_searching(res?.resData?.data));
    }
    dispatch(set_loading(false));
  };
  return (
    <div className="dashboard">
      <div style={{ paddingBottom: "16px" }}>
        <h4 style={{ margin: "0px" }}>Reconstitution Coiffes</h4>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "start",
          paddingBottom: "16px",
        }}
      >
        <div
          style={{
            paddingRight: "5px",
          }}
        >
          <Button
            style={{
              lineHeight: 0,
            }}
            color="danger"
            variant="outlined"
            onClick={() => fetchRebuild(currentView)}
            type="outlined"
            icon={<TbRefresh size={ICONSIZE.SMALL} />}
          >
            Actualiser
          </Button>
        </div>
        <CardComponent>
          <SearchComponent
            searchFor={"_pn"}
            data={rebuildData}
            placeholder={"Part Number"}
          />
        </CardComponent>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Segmented
          options={options}
          onChange={(value) => {
            setCurrentView(value);
            fetchRebuild(value);
          }}
          value={currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        />
      </div>
      <div>
        {currentView === "Gestion Coiffes (Qte)" && (
          <div
            style={{
              paddingTop: "16px",
            }}
          >
            <GammeQte />
          </div>
        )}
        {currentView === "Gestion Coiffes (%)" && (
          <div
            style={{
              paddingTop: "16px",
            }}
          >
            <GammeTaux />
          </div>
        )}
      </div>
    </div>
  );
};
export default RebuildGamme;
