import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Table,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import SharedButton from "../../components/button/button";
import { COLORS } from "../../constant/colors";
import { get_project } from "../../api/get_project";
import { get_sites } from "../../api/get_sites";
import { get_all_mouvement_stock_api } from "../../api/get_all_mouvement_stock_api";
import LoadingComponent from "../../components/loadingComponent/loadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { ajout_stock_api } from "../../api/ajout_stock_api";
import { set_loading } from "../../redux/slices";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import CardComponent from "../../components/card/cardComponent";
import { FaArrowRightToBracket } from "react-icons/fa6";

const { Option } = Select;
const items = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
];

const GestionStock = () => {
  const [form] = Form.useForm();
  const [formAdmin] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [allStockMouvement, setAllStockMouvement] = useState([]);
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
  const role = useSelector((state) => state.app.role);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchStock();
  }, []);
  const fetchStock = async () => {
    try {
      const resStock = await get_all_mouvement_stock_api(token);
      if (resStock.resData) {
        console.log(resStock.resData.data);
        setAllStockMouvement(resStock.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/cms.json");
      const json = await res.json();
      setData(json);

      const resProjet = await get_project();
      setProjetcs(resProjet?.resData?.data);

      const resSites = await get_sites();
      setSites(resSites?.resData?.data);
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
      const cmsObj = data?.CMS.find((c) => c?.sequence === val);
      if (cmsObj) {
        setSequenceValid(true);
        setPartNumbers(cmsObj?.partNumbers);
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
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout.resData.message);
    } else {
      console.log("====================================");
      console.log(resAjout.resError.response.data.message);
      console.log("====================================");
      openNotification(api, resAjout.resError.response.data.message);
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

  const onSubmitAdmin = () => {
    console.log("onSubmitAdmin");
  };

  const columns = [
    { title: "Id", dataIndex: "id", width: 60 },
    { title: "Date", dataIndex: "date_creation" },

    { title: "Séquence", dataIndex: "sequence" },
    { title: "Part Number", dataIndex: "partNumber" },
    { title: "Pattern", dataIndex: "patternNumb" },
    { title: "Matière", dataIndex: "partNumberMaterial" },
    { title: "Quantité", dataIndex: "quantite" },
    {
      title: "Statut Pattern",
      dataIndex: "statusMouvement",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {
            <FaArrowRightToBracket
              size={ICONSIZE.XSMALL}
              color={COLORS.GREEN}
            />
          }
          <span style={{ paddingLeft: "10px" }}>{text}</span>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Sequence",
      children: (
        <>
          <div style={{ width: "100%" }}>
            {data.length === 0 ||
            projects.length === 0 ||
            sites.length === 0 ? (
              <LoadingComponent height={true} header={true} />
            ) : (
              <Form layout="vertical" form={form} onFinish={onSubmit}>
                {/* Sequence */}
                <Form.Item
                  label="Séquence"
                  name="sequence"
                  required={false}
                  rules={[
                    { required: true, message: "Saisie Séquence!" },
                    {
                      validator: (_, value) => {
                        if (!value || sequenceValid) return Promise.resolve();
                        return Promise.reject(new Error("Séquence invalid"));
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
                  label="Part Number"
                  name="partNumber"
                  required={false}
                  rules={[{ required: true, message: "Choisir part Number!" }]}
                >
                  <Select
                    placeholder="Select Part Number"
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
                <Form.Item label="Matière" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>

                {/* Quantité */}
                <Form.Item
                  required={false}
                  label="Quantité"
                  name="quantite"
                  rules={[{ required: true, message: "Saisie Quantité!" }]}
                >
                  <InputNumber
                    min={1}
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
        </>
      ),
    },
    {
      key: "2",
      label: "Part Number",
      children: (
        <>
          <div style={{ width: "100%" }}>
            {data.length === 0 ||
            projects.length === 0 ||
            sites.length === 0 ? (
              <LoadingComponent height={true} header={true} />
            ) : (
              <Form layout="vertical" form={formAdmin} onFinish={onSubmitAdmin}>
                {/* Part Number */}
                <Form.Item
                  label="Part Number"
                  name="partNumber"
                  required={false}
                  // rules={[
                  //   { required: true, message: "Saisie part number!" },
                  //   {
                  //     validator: (_, value) => {
                  //       if (!value || sequenceValid) return Promise.resolve();
                  //       return Promise.reject(new Error("Part number invalid"));
                  //     },
                  //   },
                  // ]}
                >
                  <Input
                    style={{ height: "34px" }}
                    // value={sequence}
                    // onChange={(e) => handleSequenceChange(e.target.value)}
                    maxLength={12}
                  />
                </Form.Item>
                {/* Pattern */}
                <Form.Item
                  required={false}
                  label="Pattern"
                  name="patternNumb"
                  rules={[{ required: true, message: "Choisir Pattern!" }]}
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
                <Form.Item label="Matière" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>
                {/* Projet */}
                <Form.Item
                  label="Projet"
                  name="projet"
                  required={false}
                  rules={[{ required: true, message: "Choisir projet!" }]}
                >
                  <Select placeholder="Select Projet">
                    {projects.map((proj) => (
                      <Option key={proj.id} value={proj.nom}>
                        {proj.nom}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Quantité */}
                <Form.Item
                  required={false}
                  label="Quantité"
                  name="quantite"
                  rules={[{ required: true, message: "Saisie Quantité!" }]}
                >
                  <InputNumber
                    min={1}
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
        </>
      ),
    },
  ];

  return (
    <div className="dashboard">
      {contextHolder}

      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {role === "Admin" ? (
          <Tabs defaultActiveKey="1" items={items} />
        ) : (
          <>
            <div style={{ width: "100%" }}>
              {data.length === 0 ||
              projects.length === 0 ||
              sites.length === 0 ? (
                <LoadingComponent height={true} header={true} />
              ) : (
                <Form layout="vertical" form={form} onFinish={onSubmit}>
                  {/* Sequence */}
                  <Form.Item
                    label="Séquence"
                    name="sequence"
                    required={false}
                    rules={[
                      { required: true, message: "Saisie séquence!" },
                      {
                        validator: (_, value) => {
                          if (!value || sequenceValid) return Promise.resolve();
                          return Promise.reject(new Error("Séquence invalid"));
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
                    label="Part Number"
                    name="partNumber"
                    required={false}
                    rules={[
                      { required: true, message: "Choisir part Number!" },
                    ]}
                  >
                    <Select
                      placeholder="Select Part Number"
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
                      min={1}
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
          </>
        )}
      </Modal>

      {/* Breadcrumb */}
      <div style={{ padding: "10px 0px 48px 0px" }}>
        <h4 style={{ margin: "0px" }}>Gestion Stock</h4>
        <p style={{ margin: "0px", color: COLORS.Gray4 }}>
          Consultez, filtrez et gérez les mouvements de stock en temps réel
        </p>
      </div>
      <div style={{ paddingBottom: "8px" }}>
        <h6 style={{ margin: "0px" }}>Check Stock:</h6>
        <p style={{ margin: "0px", color: COLORS.Gray4 }}>message</p>
      </div>
      <CardComponent padding={"7px"}>
        <Form
          style={{
            display: "flex",
            alignItems: "center",
          }}
          layout="vertical"
          form={formAdmin}
          onFinish={onSubmitAdmin}
        >
          {/* Part Number */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="partNumber"
              required={false}
              // rules={[
              //   { required: true, message: "Saisie part number!" },
              //   {
              //     validator: (_, value) => {
              //       if (!value || sequenceValid) return Promise.resolve();
              //       return Promise.reject(new Error("Part number invalid"));
              //     },
              //   },
              // ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ paddingRight: "5px" }}>PN: </span>
                <Input
                  style={{ height: "34px" }}
                  // value={sequence}
                  // onChange={(e) => handleSequenceChange(e.target.value)}
                  maxLength={12}
                />
              </div>
            </Form.Item>
          </Col>
        </Form>
      </CardComponent>
      <div style={{ paddingTop: "35px" }}>
        <h6 style={{ margin: "0px" }}>Mouvement Stock:</h6>
        <p style={{ margin: "0px", color: COLORS.Gray4 }}>message</p>
      </div>
      <div style={{ padding: "13px 0" }}>
        <Button onClick={showModal} color="danger" variant="outlined">
          Ajouter Pattern
        </Button>
      </div>

      {/* Table */}
      <CardComponent>
        <Table
          rowClassName={() => "ant-row-no-hover"}
          className="custom-table"
          bordered
          dataSource={allStockMouvement}
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
  );
};

export default GestionStock;
