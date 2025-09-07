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
  Table,
} from "antd";
import { COLORS } from "../../constant/colors";
import CardComponent from "../../components/card/cardComponent";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { get_demande_by_id_api } from "../../api/get_demande_by_id_api";
import { status_change_api } from "../../api/status_change_api";
import { set_loading } from "../../redux/slices";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { RxCheckCircled } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { annuler_demande_api } from "../../api/annuler_demande_api";
import { update_subDemande_api } from "../../api/update_subDemande_api";

const DetailsDemande = () => {
  const [subDemandes, setSubDemandes] = useState([]);
  const [demandeMUS, setDemandeMUS] = useState([]);
  const roleList = useSelector((state) => state.app.roleList);
  const token = useSelector((state) => state.app.tokenValue);
  const userId = useSelector((state) => state.app.userId);
  const isLoading = useSelector((state) => state.app.isLoading);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [editingRowKey, setEditingRowKey] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const { id } = useParams();

  const getDemandeById = async () => {
    dispatch(set_loading(true));
    const res = await get_demande_by_id_api(id, token);
    if (res.resData) {
      console.log(res.resData.data.subDemandeMUS);
      setSubDemandes(res.resData.data.subDemandeMUS);
      setDemandeMUS(res.resData.data);
      console.log("=====Demande===============================");
      console.log(res.resData.data);
      console.log("====================================");
    }
    dispatch(set_loading(false));
  };
  useEffect(() => {
    getDemandeById();
    console.log(id);
  }, []);

  const handleInputChange = (key, field, value) => {
    setEditedRow((prev) => ({
      ...prev,
      id,
      [field]: value,
    }));
  };

  // const confirmEdit = async (record) => {
  //   try {
  //     dispatch(set_loading(true));
  //     const { quantite } = editedRow;
  //     if (record.quantite !== quantite) {
  //       const resEdit = await update_subDemande_api(
  //         record.id,
  //         id,
  //         quantite,
  //         token
  //       );
  //       if (resEdit.resData) {
  //         const updated = subDemandes.map((item) =>
  //           item.id === record.id ? { ...item, quantite } : item
  //         );
  //         setSubDemandes(updated);
  //         openNotificationSuccess(api, resEdit.resData.message);
  //         setEditingRowKey(null);
  //         setEditedRow({});
  //         getDemandeById();
  //       }
  //     }

  //     dispatch(set_loading(false));
  //   } catch (error) {
  //     console.error("Failed to update:", error);
  //   }
  // };

  const changeStatus = async () => {
    dispatch(set_loading(true));
    const resStatus = await status_change_api(id, token);
    if (resStatus.resData) {
      openNotificationSuccess(api, resStatus.resData.message);
      getDemandeById();
    } else {
      openNotification(api, resStatus.resError.response.data.message);
      console.log(resStatus.resError);
    }
    dispatch(set_loading(false));
  };

  const annulerDemamnde = async () => {
    const resStatus = await annuler_demande_api(id, token);
    if (resStatus?.resData) {
      openNotificationSuccess(api, resStatus?.resData?.message);
      getDemandeById();
    } else {
      console.log(resStatus?.resError);
    }
  };

  const breadcrumb = [
    {
      title: <Link to={"/admin"}>Dashboard</Link>,
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
      render: (text, record) =>
        editingRowKey === record.id ? (
          <InputNumber
            min={1}
            max={999}
            style={{ width: "100%", height: "34px" }}
            value={editedRow.quantite ?? record.quantite}
            onChange={(val) => handleInputChange(record.key, "quantite", val)}
          />
        ) : (
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
  // if (
  //   demandeMUS?.statusDemande === "Demande initié" &&
  //   (roleList.includes("Admin") || roleList.includes("DEMANDEUR"))
  // ) {
  //   columns.push({
  //     align: "center",
  //     title: "Action",
  //     key: "action",
  //     render: (text, record) =>
  //       editingRowKey === record.id ? (
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <div
  //             style={{
  //               paddingRight: "5px",
  //             }}
  //           >
  //             <Button
  //               style={{
  //                 padding: "10px",
  //                 border: "none",
  //                 background: COLORS.LearRed,
  //                 color: COLORS.WHITE,
  //               }}
  //               onClick={() => setEditingRowKey(null)}
  //             >
  //               <IoCloseCircleOutline size={ICONSIZE.SMALL} />
  //             </Button>
  //           </div>
  //           <div>
  //             <Button
  //               style={{
  //                 padding: "10px",
  //                 border: "none",
  //                 background: COLORS.GREEN,
  //                 color: COLORS.WHITE,
  //               }}
  //               onClick={() => confirmEdit(record)}
  //               loading={isLoading}
  //             >
  //               <RxCheckCircled size={ICONSIZE.SMALL} />
  //             </Button>
  //           </div>
  //         </div>
  //       ) : (
  //         <FiEdit
  //           onClick={() => {
  //             setEditingRowKey(record.id);
  //             setEditedRow(record);
  //           }}
  //           style={{ cursor: "pointer" }}
  //           size={ICONSIZE.SMALL}
  //         />
  //       ),
  //   });
  // }

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
          {/* <CardComponent padding={"10px"} margin={"0 0 10px 0"}> */}

          <div style={{ paddingBottom: "13px" }}>
            <p style={{ fontSize: FONTSIZE.PRIMARY }}>
              {demandeMUS.statusDemande}
            </p>
          </div>
          <CardComponent padding={"7px"}>
            <Row
              // justify={"center"}
              gutter={24}
            >
              <Col xs={24} sm={12} md={5}>
                <Form.Item label="Séquence">
                  <Input
                    style={{ height: "34px" }}
                    value={demandeMUS.sequence}
                    readOnly
                    maxLength={12}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item label="Site">
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.siteNom}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item label="Projet">
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.projetNom}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item label="Lieu detection">
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.nomDetection}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Form.Item label="Demandeur">
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.firstName + " " + demandeMUS.lastName}
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>
          </CardComponent>
          {/* </CardComponent> */}

          {/* {sequenceValid && ( */}
          <div
            style={{
              paddingTop: "17px",
            }}
          >
            {/* <CardComponent> */}
            <Table
              rowClassName={() => "ant-row-no-hover"}
              bordered
              dataSource={subDemandes}
              columns={columns}
              pagination={false}
              rowKey="id"
              size="small"
              locale={{
                emptyText: (
                  <Empty
                    description="Aucune donnée trouvée"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
            />
            {/* </CardComponent> */}
          </div>
        </Form>
        <div
          style={{
            paddingTop: "17px",
          }}
          className="d-flex justify-content-end"
        >
          <div className="pe-1">
            {demandeMUS.statusDemande === "Demande initié" &&
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
                    onClick={annulerDemamnde}
                  >
                    <IoCloseCircleOutline size={ICONSIZE.SMALL} /> Annuler
                  </Button>
                </div>
              )}
          </div>

          {demandeMUS.statusDemande === "Demande initié" &&
            (roleList.includes("Admin") || roleList.includes("AGENT_MUS")) && (
              //  Backend Check status before change in db

              <Button
                style={{
                  padding: "10px",
                  border: "none",
                  background: COLORS.Blue,
                  color: COLORS.WHITE,
                }}
                onClick={changeStatus}
              >
                <RxCheckCircled size={ICONSIZE.SMALL} /> Accepter
              </Button>
            )}
          {demandeMUS.statusDemande === "Préparation en cours" &&
            (roleList.includes("Admin") || roleList.includes("AGENT_MUS")) && (
              /* Backend Check status before change in db */

              <Button
                style={{
                  padding: "10px",
                  border: "none",
                  background: COLORS.GREEN,
                  color: COLORS.WHITE,
                }}
                onClick={changeStatus}
                loading={isLoading}
              >
                <RxCheckCircled size={ICONSIZE.SMALL} /> Livrée
              </Button>
            )}
        </div>
      </div>
    )
  );
};

export default DetailsDemande;
