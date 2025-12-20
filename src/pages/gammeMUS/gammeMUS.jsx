import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import CardComponent from "../../components/card/CardComponent";
import { HpglViewer } from "../../components/patternViewer/patternViewer";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_projet_api } from "../../api/plt/get_projet_api";
import { MdSearch } from "react-icons/md";
import { get_patterns_api } from "../../api/plt/get_patterns_api";
import { pattern_image_api } from "../../api/plt/pattern_image_api";
import { set_loading } from "../../redux/slices";
const { Option } = Select;

const GammeMUS = () => {
  const dispatch = useDispatch();
  const [project, setProject] = useState("");
  const [searchPN, setSearchPN] = useState("");
  const [desc, setDesc] = useState("");
  const [leatherPN, setLeatherPN] = useState("N/A");
  const [data, setData] = useState([]);
  const token = useSelector((state) => state.app.tokenValue);
  const isLoading = useSelector((state) => state.app.isLoading);
  const [scaleValue, setScaleValue] = useState(0.03);
  const [paternImageModal, setPaternImageModal] = useState(false);
  const [patternPNNumberCode, setPatterPNCode] = useState({});

  const handleChange = (value) => {
    setScaleValue(value);
  };

  const handleModalOpenImage = (patternPN) => {
    setPatterPNCode(patternPN);
    setPaternImageModal(true);
  };
  const handlePartNumberChange = async () => {
    dispatch(set_loading(true));
    if (searchPN !== "") {
      const _projet = await get_projet_api(searchPN, token);
      setProject(_projet.resData.projet);
      const resData = await get_patterns_api(searchPN, token);

      if (resData?.resData) {
        dispatch(set_loading(true));

        const results = await Promise.all(
          resData?.resData.map(async (item) => {
            const res = await pattern_image_api(item.pattern);
            return {
              ...item,
              hpglCode: res?.resData?.hpglCode,
              scale: 0.033,
            };
          })
        );
        console.log(results);

        setData(results);

        setDesc(resData.resData[0]?.part_number_cover_description);
        const leatherRow = (
          Array.isArray(resData.resData) ? resData.resData : []
        ).find((row) => row.type?.toLowerCase() === "supplier kit leather");
        const leatherPN = leatherRow
          ? leatherRow.semi_finished_good_part_number
          : "N/A";
        setLeatherPN(leatherPN);
      }
    }

    dispatch(set_loading(false));
  };

  return (
    <div className="dashboard">
      <div style={{ padding: "0 0 16px 0" }}>
        <h4 style={{ margin: 0 }}>Gamme MUS</h4>
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
          <CardComponent>
            <Input
              placeholder="Part Number"
              className="searchInput"
              onChange={(e) => {
                setSearchPN(e.target.value);
                if (e.target.value === "") {
                  setData([]);
                }
              }}
            />
          </CardComponent>
        </div>
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
            onClick={handlePartNumberChange}
            type="outlined"
            icon={<MdSearch size={ICONSIZE.PRIMARY} />}
          >
            Recherche
          </Button>
        </div>
      </div>
      {!isLoading && data.length > 0 ? (
        <div>
          <div
            style={{
              paddingBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h6
                style={{
                  margin: 0,
                  paddingRight: "3px",
                  fontSize: FONTSIZE.XPRIMARY,
                }}
              >
                <b>Project:</b>
              </h6>
              <p style={{ fontSize: FONTSIZE.XPRIMARY }}>{project}</p>
            </div>
            <div style={{ paddingRight: "35px" }}></div>
            <div style={{ maxWidth: "40%" }}>
              <div
                style={{
                  fontSize: FONTSIZE.XPRIMARY,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h6
                  style={{
                    margin: 0,
                    paddingRight: "3px",
                    fontSize: FONTSIZE.XPRIMARY,
                  }}
                >
                  <b>Part Number:</b>
                </h6>
                {searchPN}
              </div>
              <p style={{ fontSize: FONTSIZE.XPRIMARY }}>{desc}</p>
            </div>
            <div style={{ paddingRight: "35px" }}></div>

            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  fontSize: FONTSIZE.XPRIMARY,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h6
                  style={{
                    fontSize: FONTSIZE.XPRIMARY,
                    display: "flex",
                    margin: 0,
                  }}
                >
                  <b style={{ paddingRight: "5px" }}> Leather Kit:</b>
                </h6>
                {leatherPN}
              </div>
            </div>
          </div>
          <div style={{ margin: "auto", borderRadius: "4px" }}>
            <Row style={{ rowGap: "8px" }} gutter={[16, 16]}>
              {(Array.isArray(data) ? data : []).map((item, index) => {
                return (
                  <Col span={6} key={index} style={{ display: "flex" }}>
                    <Card
                      style={{
                        borderRadius: "4px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            cursor: "pointer",
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => handleModalOpenImage(item?.hpglCode)}
                        >
                          <HpglViewer hpglCode={item?.hpglCode} scale={0.005} />
                        </div>
                        <div style={{ marginTop: "auto", textAlign: "center" }}>
                          <p style={{ margin: "8px 0 0" }}>{item.pattern}</p>
                          <p style={{ margin: 0 }}>
                            {item.panel_number} ({item.type})
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
              <Modal
                width="auto"
                height="auto"
                title={<p style={{ margin: 0 }}>Image pattern</p>}
                open={paternImageModal}
                onCancel={() => setPaternImageModal(false)}
                footer={[]}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        paddingRight: "4px",
                      }}
                    >
                      Scale:
                    </p>
                    <Select onChange={handleChange} defaultValue={scaleValue}>
                      <Option value={0.02}>0.02</Option>
                      <Option value={0.03}>0.03</Option>
                      <Option value={0.04}>0.04</Option>
                      <Option value={0.05}>0.05</Option>
                      <Option value={0.06}>0.06</Option>
                    </Select>
                  </div>

                  <div style={{ paddingTop: "10px" }}></div>
                  <HpglViewer
                    scale={scaleValue}
                    hpglCode={patternPNNumberCode}
                  />
                </div>
              </Modal>
            </Row>
          </div>
        </div>
      ) : !isLoading && data.length === 0 ? (
        <p>Aucune donnée trouvée</p>
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
    </div>
  );
};

export default GammeMUS;
