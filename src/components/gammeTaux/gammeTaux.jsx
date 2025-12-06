import { Button, Col, Progress, Row, Skeleton, Spin } from "antd";
import CardComponent from "../card/CardComponent";
import { COLORS } from "../../constant/colors";
import SearchComponent from "../searchComponent/searchComponent";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rebuild_api } from "../../api/rebuild_api";
import { TbRefresh } from "react-icons/tb";
import { ICONSIZE } from "../../constant/FontSizes";
import { ModalDetailsGamme } from "../../pages/rebuildGamme/components/modalDetailsGamme";
import { set_data_searching, set_loading_gamme } from "../../redux/slices";

export const GammeTaux = React.memo(() => {
  const [emptyData, setEmptyData] = useState(true);
  const [selectedItem, setSelectedItem] = useState({});
  const [detailsModal, setDetailsModal] = useState(false);
  const [pn, setSelectedPN] = useState("");
  const token = useSelector((state) => state.app.tokenValue);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);
  const isLoadingSlice = useSelector((state) => state.app.isLoading);
  const isLoading = useSelector((state) => state.app.isLoadingGamme);

  useEffect(() => {
    fetchRebuild();
  }, [dispatch]);

  const fetchRebuild = async () => {
    dispatch(set_loading_gamme(true));

    const res = await rebuild_api(token);
    if (res.resData) {
      dispatch(set_data_searching(res?.resData?.data));

      setEmptyData(false);
    } else {
      setEmptyData(true);
    }
    dispatch(set_loading_gamme(false));
  };

  const getProgressColor = (valuePercent) => {
    if (valuePercent >= 60) return COLORS.Warning;
    return COLORS.LearRed;
  };

  const handleOpenModal = (item, _pn) => {
    setSelectedItem(item);
    setDetailsModal(true);
    setSelectedPN(_pn);
  };

  const handleCloseModal = () => {
    setSelectedItem({});
    setDetailsModal(false);
  };

  return (
    <div>
      {!isLoading &&
      !isLoadingSlice &&
      !emptyData &&
      searchingData?.length > 0 ? (
        <Row
          style={{
            paddingBottom: "16px",
          }}
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          {searchingData.map((item, index) => (
            <Col
              key={index}
              span={8}
              style={{
                cursor: "pointer",
                paddingBottom: "16px",
              }}
              onClick={() =>
                handleOpenModal(
                  item.resultFromRebuilService.results,
                  item.resultFromRebuilService.pn
                )
              }
            >
              <CardComponent padding={"8px"}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>{`${item.resultFromRebuilService.pn}`}</p>
                  <p>{`${item.projet}`}</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      Taux de Complétion:
                    </p>
                    <Progress
                      type="circle"
                      percent={item.resultFromRebuilService.taux}
                      size={50}
                      strokeColor={getProgressColor(
                        item.resultFromRebuilService.taux
                      )}
                      strokeWidth={7}
                      format={(percent) => (
                        <span style={{ color: COLORS.BLACK }}>{percent}%</span>
                      )}
                    />
                  </div>
                </div>
              </CardComponent>
            </Col>
          ))}
        </Row>
      ) : !isLoading && !isLoadingSlice ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <p>Aucune donnée trouvée</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <Spin size="small" />
        </div>
      )}

      <ModalDetailsGamme
        pn={pn}
        isChangeStatusPage={false}
        patterns={selectedItem}
        detailsModal={detailsModal}
        setDetailsModal={handleCloseModal}
      />
    </div>
  );
});
