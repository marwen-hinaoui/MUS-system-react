import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import SharedButton from "../../components/button/button";
import { COLORS } from "../../constant/colors";
import { get_project } from "../../api/get_project";
import { get_sites } from "../../api/get_sites";
import { get_all_stock_api } from "../../api/get_all_stock_api";
import LoadingComponent from "../../components/loadingComponent/loadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { ajout_stock_api } from "../../api/ajout_stock_api";
import { set_loading } from "../../redux/slices";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { MdDelete } from "react-icons/md";
import CardComponent from "../../components/card/cardComponent";

const { Option } = Select;

const breadcrumb = [
  { title: <RiDashboardHorizontalLine /> },
  { title: <Link to={"/admin"}>Dashboard</Link> },
  { title: "Gestion stock" },
];

const GestionStock = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [allStock, setAllStock] = useState([]);
  const [projects, setProjetcs] = useState([]);
  const [sites, setSites] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [sequence, setSequence] = useState("");
  const [sequenceValid, setSequenceValid] = useState(false);
  const [partNumbers, setPartNumbers] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [materialPartNumber, setMaterialPartNumber] = useState("");
  const token = useSelector((state) => state.app.tokenValue);
  const isLoading = useSelector((state) => state.app.isLoading);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchStock();
  }, []);
  const fetchStock = async () => {
    const resStock = await get_all_stock_api(token);
    console.log(resStock.resData.data);
    setAllStock(resStock.resData.data);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/cms.json");
      const json = await res.json();
      setData(json);

      const resProjet = await get_project();
      setProjetcs(resProjet.resData.data);

      const resSites = await get_sites();
      setSites(resSites.resData.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  const showModal = () => {
    fetchData();
    setIsModalOpen(true);
  };

  const handleSequenceChange = (val) => {
    setSequence(val);

    if (/^\d{12}$/.test(val)) {
      if (!Array.isArray(data?.CMS)) return [];
      const cmsObj = data.CMS.find((c) => c.sequence === val);
      if (cmsObj) {
        setSequenceValid(true);
        setPartNumbers(cmsObj.partNumbers);
      } else {
        setSequenceValid(false);
        setPartNumbers([]);
      }
    } else {
      setSequenceValid(false);
      setPartNumbers([]);
    }
    form.setFieldsValue({ partNumber: undefined, patternNumb: undefined });
    setAvailablePatterns([]);
    setMaterialPartNumber("");
  };

  const handlePartNumberChange = (partNumber) => {
    const partObj = partNumbers.find((p) => p.partNumber === partNumber);
    if (partObj) {
      const mats = partObj.materials;
      const patterns = mats.flatMap((mat) => data.Materials[0][mat] || []);
      setAvailablePatterns(patterns);
    } else {
      setAvailablePatterns([]);
    }
    form.setFieldsValue({ patternNumb: undefined });
    setMaterialPartNumber("");
  };

  const handlePatternChange = (pattern) => {
    const partNumber = form.getFieldValue("partNumber");
    const partObj = partNumbers.find((p) => p.partNumber === partNumber);
    if (!partObj) return;

    const matchedMat =
      partObj.materials.find((mat) =>
        data.Materials[0][mat]?.includes(Number(pattern))
      ) || "";

    setMaterialPartNumber(matchedMat);
    form.setFieldsValue({ materialPartNumber: matchedMat });
  };

  const onSubmit = async (values) => {
    dispatch(set_loading(true));
    const piece = {
      projetNom: values.projet,
      sequence: values.sequence,
      partNumber: values.partNumber,
      patternNumb: values.patternNumb,
      partNumberMaterial: values.materialPartNumber,
      quantiteAjouter: values.quantite,
    };

    const resAjout = await ajout_stock_api(piece, token);
    console.log("Final Object:", resAjout.resData);
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout.resData.message);
    } else {
      openNotification(api, resAjout.resData.message);
    }
    dispatch(set_loading(false));
    form.resetFields();
    setSequence("");
    setSequenceValid(false);
    setPartNumbers([]);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    setIsModalOpen(false);
    fetchStock();
  };

  const columns = [
    { title: "id", dataIndex: "id", width: 60 },
    { title: "Projet", dataIndex: "projetName" },
    { title: "Séquence", dataIndex: "sequence" },
    { title: "Part number", dataIndex: "partNumber" },
    { title: "Material", dataIndex: "partNumberMaterial" },
    { title: "Pattern", dataIndex: "patternNumb" },
    { title: "Quantite", dataIndex: "quantite" },
    { title: "Status", dataIndex: "status" },
    
  ];
  if (allStock.length === 0) return <LoadingComponent header={true} />;

  return (
    allStock.length > 0 && (
      <div className="dashboard">
        {contextHolder}

        <Modal
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <div style={{ width: "100%" }}>
            {data.length === 0 ||
            projects.length === 0 ||
            sites.length === 0 ? (
              <LoadingComponent height={true} header={true} />
            ) : (
              <Form layout="vertical" form={form} onFinish={onSubmit}>
                {/* Sequence */}
                <Form.Item
                  label="Sequence"
                  name="sequence"
                  required={false}
                  rules={[
                    { required: true, message: "Saisie sequence!" },
                    {
                      validator: (_, value) => {
                        if (!value || sequenceValid) return Promise.resolve();
                        return Promise.reject(
                          new Error("Invalid sequence or not in CMS")
                        );
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ height: "34px" }}
                    value={sequence}
                    onChange={(e) => handleSequenceChange(e.target.value)}
                    maxLength={12}
                  />
                </Form.Item>

                {/* Projet */}
                <Form.Item
                  label="Projet"
                  name="projet"
                  required={false}
                  rules={[{ required: true, message: "Choisir projet!" }]}
                >
                  <Select placeholder="Select projet">
                    {projects.map((proj) => (
                      <Option key={proj.id} value={proj.nom}>
                        {proj.nom}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Part Number */}
                <Form.Item
                  label="Part number"
                  name="partNumber"
                  required={false}
                  rules={[{ required: true, message: "Choisir part number!" }]}
                >
                  <Select
                    placeholder="Select Part number"
                    onChange={handlePartNumberChange}
                    disabled={!sequenceValid}
                  >
                    {partNumbers.map((p) => (
                      <Option key={p.partNumber} value={p.partNumber}>
                        {p.partNumber}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Pattern */}
                <Form.Item
                  required={false}
                  label="Pattern"
                  name="patternNumb"
                  rules={[{ required: true, message: "Choisir pattern!" }]}
                >
                  <Select
                    placeholder="Select Pattern"
                    onChange={handlePatternChange}
                    disabled={availablePatterns.length === 0}
                  >
                    {availablePatterns.map((pat, i) => (
                      <Option key={i} value={pat}>
                        {pat}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Material */}
                <Form.Item label="Material" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>

                {/* Quantité */}
                <Form.Item
                  required={false}
                  label="Quantité"
                  name="quantite"
                  rules={[{ required: true, message: "Saisie quantité!" }]}
                >
                  <InputNumber
                    min={0}
                    max={999}
                    style={{ width: "100%", height: "34px" }}
                  />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <SharedButton
                    loading={isLoading}
                    type="primary"
                    name="Enregistrer"
                    color={COLORS.LearRed}
                    htmlType="submit"
                  />
                </div>
              </Form>
            )}
          </div>
        </Modal>

        {/* Breadcrumb */}
        <div style={{ paddingBottom: "13px" }}>
          <Breadcrumb
            style={{ fontSize: FONTSIZE.XPRIMARY }}
            items={breadcrumb}
          />
        </div>

        <div style={{ paddingBottom: "13px" }}>
          <Button onClick={showModal} color="danger" variant="outlined">
            Ajout pièce
          </Button>
        </div>

        {/* Table */}
        <CardComponent>
          <Table
            rowClassName={() => "ant-row-no-hover"}
            className="custom-table"
            bordered
            dataSource={allStock}
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "25", "50", "100"],
            }}
            locale={{
              emptyText: (
                <Empty
                  description="Aucune donnée trouvée"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            size="small"
          />
        </CardComponent>
      </div>
    )
  );
};

export default GestionStock;
