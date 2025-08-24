import {
  Breadcrumb,
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import { COLORS } from "../../constant/colors";
import { MdDelete } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import CardComponent from "../../components/card/cardComponent";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { get_demande_by_id_api } from "../../api/get_demande_by_id_api";
import { set_loading } from "../../redux/slices";
import LoadingComponent from "../../components/loadingComponent/loadingComponent";
const { Option } = Select;

const DetailsDemande = () => {
  const [subDemandes, setSubDemandes] = useState([]);
  const [demandeMUS, setDemandeMUS] = useState();
  const role = useSelector((state) => state.app.role);
  const token = useSelector((state) => state.app.tokenValue);
  const isLoading = useSelector((state) => state.app.isLoading);
  const dispatch = useDispatch();

  const { id } = useParams();

  const getDemandeById = async () => {
    dispatch(set_loading(true));
    const res = await get_demande_by_id_api(id, token);
    console.log(res.resData.data.subDemandeMUS);
    setSubDemandes(res.resData.data.subDemandeMUS);
    setDemandeMUS(res.resData.data);
    dispatch(set_loading(false));
  };
  useEffect(() => {
    getDemandeById();
    console.log(role);
    console.log(id);
  }, []);
  const breadcrumb = [
    {
      title: <RiDashboardHorizontalLine />,
    },

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
      title: "Material",
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
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text, record) => (
        <InputNumber
          readOnly
          min={0}
          max={999}
          // style={{ padding: "3px" }}
          style={{ width: "100%", height: "34px" }}
          value={record.quantite}
        />
      ),
    },
    {
      title: "Stock",
      dataIndex: "disponible",
      key: "disponible",
      render: (text, record) => (
        <div>
          {record.disponible ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <AiOutlineCheckCircle
                color={COLORS.GREEN}
                size={ICONSIZE.SMALL}
              />
              <p> En stock</p>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoCloseCircleOutline
                color={COLORS.LearRed}
                size={ICONSIZE.SMALL}
              />
              <p> Hors stock</p>
            </div>
          )}
        </div>
      ),
    },
  ];
  if (isLoading) {
    return <LoadingComponent header={true} />;
  }
  return (
    subDemandes &&
    demandeMUS && (
      <div className="dashboard">
        <div style={{ paddingBottom: "13px" }}>
          <Breadcrumb
            style={{ fontSize: FONTSIZE.XPRIMARY }}
            items={breadcrumb}
          />
        </div>
        <Form layout="vertical">
          {/* <CardComponent padding={"10px"} margin={"0 0 10px 0"}> */}
          <CardComponent padding={"7px"}>
            <Row gutter={24}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Sequence">
                  <Input
                    style={{ height: "34px" }}
                    value={demandeMUS.Sequence}
                    readOnly
                    maxLength={12}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Site">
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.siteNom}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Projet" required>
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    value={demandeMUS.projetNom}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Lieu detection" required>
                  <Input
                    style={{ width: "100%", height: "34px" }}
                    // value={record.lei}
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
            <CardComponent>
              <Table
                rowClassName={() => "ant-row-no-hover"}
                bordered
                dataSource={subDemandes}
                columns={columns}
                pagination={false}
                rowKey="key"
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
            </CardComponent>
          </div>
        </Form>
        <div
          style={{
            paddingTop: "17px",
          }}
          className="d-flex justify-content-end"
        >
          <div className="pe-1">
            {role === "Admin" && (
              <Popconfirm
                title="Supprimer"
                description="Voulez-vous supprimer cette demande?"
                onConfirm={() => alert("deleted")}
              >
                <Button
                  style={{
                    padding: "10px",
                    border: "none",
                    background: COLORS.LearRed,
                    color: COLORS.WHITE,
                  }}
                >
                  <MdDelete />
                </Button>
              </Popconfirm>
            )}
          </div>

          {demandeMUS.statusDemande === "En cours" &&
            (role === "Admin" || role === "AGENT_MUS") && (
              /* Backend Check status before change in db */
              <Popconfirm
                title="Confirmation"
                description="Voulez-vous cloturer cette demande?"
                onConfirm={() => alert("confirmed")}
              >
                <Button
                  style={{
                    padding: "10px",
                    border: "none",
                    background: COLORS.GREEN,
                    color: COLORS.WHITE,
                  }}
                >
                  <AiOutlineCheckCircle />
                </Button>
              </Popconfirm>
            )}
        </div>
      </div>
    )
  );
};

export default DetailsDemande;
