import {
  Breadcrumb,
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Table,
} from "antd";
import { COLORS } from "../../constant/colors";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import React, { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { get_demande_by_id_api } from "../../api/get_demande_by_id_api";
import { status_change_api } from "../../api/status_change_api";
import { set_loading } from "../../redux/slices";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { RxCheckCircled } from "react-icons/rx";
// import { FiEdit } from "react-icons/fi";
import { annuler_demande_api } from "../../api/annuler_demande_api";
// import { update_subDemande_api } from "../../api/update_subDemande_api";
import CardComponent from "../../components/card/cardComponent";
import { SharedModal } from "./sharedModal";
import "./details.css";
import { get_bin_from_pattern_api } from "../../api/get_bin_from_pattern_api";
import { get_bin_from_pattern_api_livree } from "../../api/get_bin_from_pattern_api_livree";

const DetailsDemande = () => {
  const [subDemandes, setSubDemandes] = useState([]);
  const [allBins, setAllBins] = useState([]);
  const [demandeMUS, setDemandeMUS] = useState([]);
  const [validColumns, setValidColumns] = useState(0);
  const [modalLivree, setModalLivree] = useState(false);
  const [modalAnnuler, setModalAnnuler] = useState(false);
  const [selectedBins, setSelectedBins] = useState([]);

  const [accepter, setAccepter] = useState(false);
  const roleList = useSelector((state) => state.app.roleList);
  const token = useSelector((state) => state.app.tokenValue);
  const userId = useSelector((state) => state.app.userId);
  const isLoading = useSelector((state) => state.app.isLoading);
  const redirect = useSelector((state) => state.app.redirect);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const { id } = useParams();

  const getDemandeById = async () => {
    dispatch(set_loading(true));
    const res = await get_demande_by_id_api(id, token);
    if (res.resData) {
      console.log(res.resData.data.subDemandeMUS);
      setSubDemandes(res.resData.data.subDemandeMUS);
      setDemandeMUS(res.resData.data);
      fetBinsFromSubDemande(res.resData.data.subDemandeMUS);
    }
    dispatch(set_loading(false));
  };
  useEffect(() => {
    getDemandeById();
  }, []);

  const fetBinsFromSubDemande = async (subDemandeMUS) => {
    let binStorage = {};
    let tmpArray = [];

    for (const element of subDemandeMUS) {
      let bins = await fetchBinsStorate(
        element.partNumber,
        element.patternNumb
      );

      binStorage[element.numSubDemande] = bins;
      tmpArray.push(binStorage);
    }

    setAllBins(...tmpArray);
  };

  const changeStatus = async (type) => {
    dispatch(set_loading(true));
    const resStatus = await status_change_api(
      id,
      token,
      type,
      type === "Livree" ? selectedBins : []
    );
    if (resStatus.resData) {
      openNotificationSuccess(api, resStatus?.resData?.message);
      getDemandeById();
      if (type === "Accepter") {
        setAccepter(false);
      }
      if (type === "Livree") {
        setModalLivree(false);
      }
    } else {
      openNotification(api, resStatus?.resError?.response?.data?.message);
      console.log(resStatus?.resError);
    }
    dispatch(set_loading(false));
  };

  const handleBinChange = (numSubDemande, value) => {
    setSelectedBins((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.numSubDemande === numSubDemande
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].bin = value;
        return updated;
      }

      return [...prev, { numSubDemande, bin: value }];
    });
  };

  const fetchBinsStorate = async (partNumber, pattern) => {
    try {
      const resBinFromPattern = await get_bin_from_pattern_api_livree(
        partNumber,
        pattern,
        token
      );

      console.log("resBinFromPattern?.resData?.data");
      console.log(resBinFromPattern?.resData?.data);
      return resBinFromPattern?.resData?.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const annulerDemamnde = async () => {
    dispatch(set_loading(true));

    const resStatus = await annuler_demande_api(id, token);
    if (resStatus?.resData) {
      openNotificationSuccess(api, resStatus?.resData?.message);
      getDemandeById();
      setModalAnnuler(false);
    } else {
      openNotification(api, resStatus?.resError?.response?.data?.message);

      console.log(resStatus?.resError);
    }
    dispatch(set_loading(false));
  };

  const breadcrumb = [
    {
      title: <Link to={redirect}>Suivi des demandes</Link>,
    },

    {
      title: `Détails ${demandeMUS && demandeMUS.numDemande}`,
    },
  ];

  const columns = [
    {
      title: "Sub demande",
      dataIndex: "numSubDemande",
      key: "numSubDemande",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.numSubDemande}
          readOnly
        />
      ),
    },
    {
      title: "Part number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.partNumber}
          readOnly
        />
      ),
    },

    {
      title: "Pattern",
      dataIndex: "patternNumb",
      key: "patternNumb",
      render: (text, record) => {
        return (
          <Input
            style={{ width: "100%", height: "34px" }}
            value={record.patternNumb}
            readOnly
          />
        );
      },
    },
    {
      title: "Bin de stockage",
      dataIndex: "bin",
      key: "bin",
      render: (text, record) => {
        const binOptions = allBins[record.numSubDemande]?.map((p) => ({
          label: `${p.bin_code} -> ${p.status}`,
          value: p.bin_code,
          status: p.status,
          style: {
            marginBottom: 2,
            marginTop: 2,
            background:
              p.status === "Vide"
                ? COLORS.GREEN_ALERT
                : p.status === "Plein"
                ? COLORS.REDWHITE
                : COLORS.WARNIGN_ALERT_TABLE_COLUMN,
          },
        }));

        return (
          <Select
            placeholder="Select Bin de stockage"
            disabled={binOptions?.length === 0}
            style={{ width: "100%", height: "34px" }}
            options={binOptions}
            value={
              selectedBins.find(
                (item) => Object.keys(item)[0] === record.numSubDemande
              )?.[record.numSubDemande]
            }
            onChange={(value) => {
              handleBinChange(record.numSubDemande, value);
              setValidColumns((prev) => prev + 1);
            }}
          />
        );
      },
    },

    {
      title: "Matière",
      dataIndex: "materialPartNumber",
      key: "materialPartNumber",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.materialPartNumber}
          readOnly
        />
      ),
    },
    {
      title: "Defaut",
      dataIndex: "defaut",
      key: "defaut",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={`${record.code_defaut} (${record.typeDefaut})`}
          readOnly
        />
      ),
    },
    {
      width: 150,
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text, record) => (
        <InputNumber
          value={record.quantite}
          readOnly
          style={{ width: "100%", height: "34px" }}
        />
      ),
    },
    {
      width: 150,
      title: "Quantité disponible",
      dataIndex: "quantiteDisponible",
      key: "quantiteDisponible",
      render: (text, record) => (
        <InputNumber
          readOnly
          min={1}
          max={999}
          style={{ width: "100%", height: "34px" }}
          value={record.quantiteDisponible}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "statusSubDemande",
      key: "statusSubDemande",
      render: (text, record) => <div>{record.statusSubDemande}</div>,
    },
  ];
  const columnInit = [
    {
      title: "Sub demande",
      dataIndex: "numSubDemande",
      key: "numSubDemande",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.numSubDemande}
          readOnly
        />
      ),
    },
    {
      title: "Part number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.partNumber}
          readOnly
        />
      ),
    },

    {
      title: "Pattern",
      dataIndex: "patternNumb",
      key: "patternNumb",
      render: (text, record) => {
        return (
          <Input
            style={{ width: "100%", height: "34px" }}
            value={record.patternNumb}
            readOnly
          />
        );
      },
    },

    {
      title: "Matière",
      dataIndex: "materialPartNumber",
      key: "materialPartNumber",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.materialPartNumber}
          readOnly
        />
      ),
    },
    {
      title: "Defaut",
      dataIndex: "defaut",
      key: "defaut",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={`${record.code_defaut} (${record.typeDefaut})`}
          readOnly
        />
      ),
    },
    {
      width: 150,
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text, record) => (
        <InputNumber
          value={record.quantite}
          readOnly
          style={{ width: "100%", height: "34px" }}
        />
      ),
    },
    {
      width: 150,
      title: "Quantité disponible",
      dataIndex: "quantiteDisponible",
      key: "quantiteDisponible",
      render: (text, record) => (
        <InputNumber
          readOnly
          min={1}
          max={999}
          style={{ width: "100%", height: "34px" }}
          value={record.quantiteDisponible}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "statusSubDemande",
      key: "statusSubDemande",
      render: (text, record) => <div>{record.statusSubDemande}</div>,
    },
  ];

  return (
    subDemandes &&
    demandeMUS && (
      <div className="dashboard">
        {contextHolder}

        <div style={{ paddingBottom: "13px" }}>
          <Breadcrumb
            style={{ fontSize: FONTSIZE.XPRIMARY }}
            items={breadcrumb}
          />
        </div>
        <Form layout="vertical">
          <div style={{ paddingBottom: "13px" }}>
            <p style={{ fontSize: FONTSIZE.PRIMARY }}>
              <b>Status demande : </b>
              {demandeMUS.statusDemande}
            </p>
          </div>
          <CardComponent padding={"17px"}>
            <Row align={"middle"} gutter={24}>
              <Col xs={24} sm={12} md={4}>
                <Form.Item style={{ marginBottom: "0" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ paddingRight: "5px" }}>Seq: </span>
                    <Input
                      style={{ height: "34px" }}
                      value={demandeMUS.sequence}
                      readOnly
                      maxLength={12}
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Form.Item style={{ marginBottom: "0" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ paddingRight: "5px" }}>Projet:</span>
                    <Input
                      style={{ width: "100%", height: "34px" }}
                      value={demandeMUS.projetNom}
                      readOnly
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item style={{ marginBottom: "0" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="text-detail-wrap">Lieu detection:</span>
                    <Input
                      style={{ width: "100%", height: "34px" }}
                      value={demandeMUS.nomDetection}
                      readOnly
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item style={{ marginBottom: "0" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="text-detail-wrap">Demandeur:</span>
                    <Input
                      style={{ width: "100%", height: "34px" }}
                      value={demandeMUS.demandeur}
                      readOnly
                    />
                  </div>
                </Form.Item>
              </Col>
              {demandeMUS.statusDemande === "Demande annulé" && (
                <Col xs={24} sm={12} md={4}>
                  <Form.Item style={{ marginBottom: "0" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="text-detail-wrap">Annulée par: </span>
                      <Input
                        style={{ width: "100%", height: "34px" }}
                        value={demandeMUS.annulerPar}
                        readOnly
                      />
                    </div>
                  </Form.Item>
                </Col>
              )}
              {(demandeMUS.statusDemande == "Demande livrée" ||
                demandeMUS.statusDemande == "Demande partiellement livrée" ||
                demandeMUS.statusDemande == "Préparation en cours") && (
                <>
                  <Col ol xs={24} sm={12} md={4}>
                    <Form.Item style={{ marginBottom: "0" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="text-detail-wrap">Acceptée par:</span>
                        <Input
                          style={{ width: "100%", height: "34px" }}
                          value={demandeMUS.accepterPar}
                          readOnly
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  {demandeMUS.statusDemande !== "Préparation en cours" && (
                    <Col xs={24} sm={12} md={4}>
                      <Form.Item style={{ marginBottom: "0" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="text-detail-wrap">Livrée par: </span>
                          <Input
                            style={{ width: "100%", height: "34px" }}
                            value={demandeMUS.livreePar}
                            readOnly
                          />
                        </div>
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
            </Row>
          </CardComponent>

          {/* {sequenceValid && ( */}
          <div
            style={{
              paddingTop: "17px",
            }}
          >
            <Table
              bordered
              dataSource={subDemandes}
              columns={
                demandeMUS.statusDemande === "Préparation en cours" &&
                (roleList.includes("Admin") ||
                  roleList.includes("AGENT_MUS") ||
                  roleList.includes("GESTIONNAIRE_STOCK"))
                  ? columns
                  : columnInit
              }
              pagination={false}
              rowKey="id"
              size="small"
              locale={{
                emptyText: (
                  // <Empty
                  //   description="Aucune donnée trouvée"
                  //   image={Empty.PRESENTED_IMAGE_SIMPLE}
                  // />
                  <p>Aucune donnée trouvée</p>
                ),
              }}
            />
          </div>
        </Form>
        <div
          style={{
            paddingTop: "17px",
          }}
          className="d-flex justify-content-end"
        >
          <div className="pe-1">
            {demandeMUS.statusDemande === "Demande initiée" &&
              (roleList.includes("Admin") ||
                (roleList.includes("DEMANDEUR") &&
                  demandeMUS.id_userMUS === userId)) && (
                <div className="d-flex">
                  <Button
                    style={{
                      padding: "10px",
                      border: "none",
                      background: COLORS.LearRed,
                      color: COLORS.WHITE,
                    }}
                    onClick={() => setModalAnnuler(true)}
                  >
                    <IoCloseCircleOutline size={ICONSIZE.SMALL} /> Annuler
                  </Button>
                </div>
              )}
          </div>

          {demandeMUS.statusDemande === "Demande initiée" &&
            (roleList.includes("Admin") ||
              roleList.includes("AGENT_MUS") ||
              roleList.includes("GESTIONNAIRE_STOCK")) && (
              <Button
                style={{
                  padding: "10px",
                  border: "none",
                  background: COLORS.Blue,
                  color: COLORS.WHITE,
                }}
                onClick={() => setAccepter(true)}
              >
                <IoCheckmarkCircleOutline size={ICONSIZE.SMALL} /> Accepter
              </Button>
            )}
          {demandeMUS.statusDemande === "Préparation en cours" &&
            (roleList.includes("Admin") ||
              roleList.includes("AGENT_MUS") ||
              roleList.includes("GESTIONNAIRE_STOCK")) && (
              <Button
                disabled={validColumns < subDemandes.length}
                style={{
                  padding: "10px",
                  border: "none",
                  background:
                    validColumns < subDemandes.length
                      ? "rgb(55 138 58 / 71%)"
                      : COLORS.GREEN,
                  color: COLORS.WHITE,
                }}
                onClick={() => {
                  setModalLivree(true);
                  console.log(selectedBins);
                  console.log(typeof selectedBins);
                }}
              >
                <RxCheckCircled size={ICONSIZE.SMALL} /> Livrée
              </Button>
            )}
        </div>
        <SharedModal
          callback={() => setAccepter(false)}
          message={"Voulez vous accepter cette demande ?"}
          modalState={accepter}
          isLoading={isLoading}
          changeStatus={() => changeStatus("Accepter")}
        />
        <SharedModal
          callback={() => setModalLivree(false)}
          message={"Voulez vous livrer cette demande ?"}
          modalState={modalLivree}
          isLoading={isLoading}
          changeStatus={() => changeStatus("Livree")}
        />
        <SharedModal
          callback={() => setModalAnnuler(false)}
          message={"Voulez-vous annuler cette demande ?"}
          modalState={modalAnnuler}
          isLoading={isLoading}
          changeStatus={annulerDemamnde}
        />
      </div>
    )
  );
};

export default DetailsDemande;
