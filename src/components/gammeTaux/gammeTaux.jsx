import { Button, Col, Progress, Row, Skeleton, Spin } from "antd";
import CardComponent from "../card/cardComponent";
import { COLORS } from "../../constant/colors";
import SearchComponent from "../searchComponent/searchComponent";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rebuild_api } from "../../api/rebuild_api";
import { TbRefresh } from "react-icons/tb";
import { ICONSIZE } from "../../constant/FontSizes";
import { ModalDetailsGamme } from "../../pages/rebuildGamme/components/modalDetailsGamme";
import { set_data_searching } from "../../redux/slices";

export const GammeTaux = React.memo(() => {
  const [rebuilData, setRebuilData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [emptyData, setEmptyData] = useState(true);
  const [selectedItem, setSelectedItem] = useState({});
  const [detailsModal, setDetailsModal] = useState(false);
  const token = useSelector((state) => state.app.tokenValue);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  useEffect(() => {
    fetchRebuild();
  }, [dispatch]);

  const fetchRebuild = async () => {
    setLoading(true);
    const res = await rebuild_api(token);
    if (res.resData) {
      setRebuilData(res?.resData?.data);
      dispatch(set_data_searching(res?.resData?.data));

      setEmptyData(false);
    } else {
      setEmptyData(true);
    }
    setLoading(false);
  };

  const getProgressColor = (valuePercent) => {
    if (valuePercent >= 60) return COLORS.Warning;
    return COLORS.LearRed;
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setDetailsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem({});
    setDetailsModal(false);
  };

  return (
    <div>
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
            onClick={() => fetchRebuild()}
            type="outlined"
            icon={<TbRefresh size={ICONSIZE.SMALL} />}
          >
            Actualiser
          </Button>
        </div>
        <div>
          <CardComponent padding={"4px"}>
            <SearchComponent
              searchFor={"_pn"}
              data={rebuilData}
              placeholder={"Part Number"}
            />
          </CardComponent>
        </div>
      </div>
      {!isLoading && !emptyData && searchingData?.length > 0 ? (
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
                handleOpenModal(item.resultFromRebuilService.results)
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
      ) : !isLoading ? (
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
        isChangeStatusPage={false}
        patterns={selectedItem}
        detailsModal={detailsModal}
        setDetailsModal={handleCloseModal}
      />
    </div>
  );
});
