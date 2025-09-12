import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import SharedButton from "../../components/button/button";
import { COLORS } from "../../constant/colors";
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

import { check_stock_api } from "../../api/check_stock_api";
import { ajout_stock_admin_api } from "../../api/ajout_stock_admin_api";
import { get_patterns_api } from "../../api/get_patterns_api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import "./gestionStock.css";
const { Option } = Select;
const { RangePicker } = DatePicker;
const GestionStock = () => {
  const [form] = Form.useForm();
  const [formAdmin] = Form.useForm();
  const [formCheck] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [allStockMouvement, setAllStockMouvement] = useState([]);
  const [sites, setSites] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [sequence, setSequence] = useState("");
  const [partNumberAdmin, setPartNumberAdmin] = useState("");
  const [sequenceValid, setSequenceValid] = useState(false);
  const [partNumbers, setPartNumbers] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [materialPartNumber, setMaterialPartNumber] = useState("");
  const token = useSelector((state) => state.app.tokenValue);
  const isLoading = useSelector((state) => state.app.isLoading);
  const roleList = useSelector((state) => state.app.roleList);
  const [projetNom, setProjet] = useState("");
  const [stock, setStock] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [exportDateRange, setExportDateRange] = useState([]);

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

      const resSites = await get_sites();
      setSites(resSites?.resData?.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  const exportToExcel = () => {
    if (!allStockMouvement || allStockMouvement.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    // Filter by date range
    let filteredData = allStockMouvement;
    if (exportDateRange && exportDateRange.length === 2) {
      const [start, end] = exportDateRange;
      filteredData = allStockMouvement.filter((item) => {
        const itemDate = dayjs(item.date_creation, "YYYY-MM-DD");
        return (
          itemDate.isSame(start, "day") ||
          itemDate.isSame(end, "day") ||
          (itemDate.isAfter(start, "day") && itemDate.isBefore(end, "day"))
        );
      });
    }

    if (filteredData.length === 0) {
      openNotification(api, "Aucune donnée trouvée pour cette période !");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MouvementStock");

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const fileName = `MouvementStock_${exportDateRange}.xlsx`;
    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );
    saveAs(dataBlob, fileName);
  };

  const getPatterns = async (e) => {
    setPatterns([]);
    setStock("");

    if (e.target.value.length >= 15) {
      const resPatterns = await get_patterns_api(e.target.value, token);
      if (resPatterns.resData) {
        console.log(resPatterns.resData.data);

        setPatterns(resPatterns.resData.data);
      }
    }
  };
  const checkStock = async (partNumber, patternNumb) => {
    try {
      const res = await check_stock_api(partNumber, patternNumb, token);
      if (res.resData) {
        setStock(res.resData.data);
        console.log(res.resData);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const showModal = () => {
    fetchData();
    setIsModalOpen(true);
  };

  const handleSequenceChange = (val) => {
    if (/^\d{12}$/.test(val)) {
      if (!Array.isArray(data?.CMS)) return [];
      const cmsObj = data?.CMS.find((c) => c?.sequence === val);
      if (cmsObj) {
        setSequence(val);
        setProjet(cmsObj.projetNom);
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

  const handlePartNumberChangeAdmin = (e) => {
    const partNumber = e.target.value;
    let partObj;
    for (const cms of data?.CMS) {
      partObj = cms?.partNumbers.find((p) => p?.partNumber === partNumber);
      if (partObj) {
        setProjet(cms.projetNom);
        break;
      }
    }

    if (partObj) {
      setPartNumberAdmin(partObj);
      const mats = partObj?.materials;
      const patterns = mats?.flatMap((mat) => data?.Materials[0][mat] || []);
      setAvailablePatterns(patterns);
    } else {
      setAvailablePatterns([]);
    }

    form.setFieldsValue({});
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

  const handlePatternChangeAdmin = (pattern) => {
    const matchedMat =
      partNumberAdmin?.materials?.find((mat) =>
        data.Materials[0][mat]?.includes(Number(pattern))
      ) || "";

    setMaterialPartNumber(matchedMat);
    formAdmin.setFieldsValue({ materialPartNumber: matchedMat });
  };

  const onSubmit = async (values) => {
    dispatch(set_loading(true));
    const piece = {
      projetNom: projetNom,
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
      console.log(resAjout.resError.response.data.message);
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

  const onSubmitAdmin = async (values) => {
    dispatch(set_loading(true));
    const piece = {
      projetNom: projetNom,
      sequence: "x",
      partNumber: values.partNumber,
      patternNumb: values.patternNumb,
      partNumberMaterial: values.materialPartNumber,
      quantiteAjouter: values.quantite,
    };

    const resAjout = await ajout_stock_admin_api(piece, token);
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout.resData.message);
      setIsModalOpen(false);
      fetchStock();
    } else {
      console.log(resAjout.resError.response.data.message);
    }
    dispatch(set_loading(false));
    formAdmin.resetFields();
    setSequence("");
    setSequenceValid(false);
    setPartNumbers([]);
    setAvailablePatterns([]);
    setPartNumberAdmin("");
    setMaterialPartNumber("");
  };

  const columns = [
    { title: "Id", dataIndex: "id", width: 60 },
    {
      title: "Date",
      dataIndex: "date_creation",

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            format="YYYY-MM-DD"
            value={selectedKeys[0] || []}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
            }}
            style={{ marginBottom: 8, display: "flex" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Filtrer
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Réinitialiser
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const recordDate = dayjs(record.date_creation, "YYYY-MM-DD");
        return (
          recordDate.isSame(value[0], "day") ||
          recordDate.isSame(value[1], "day") ||
          (recordDate.isAfter(value[0], "day") &&
            recordDate.isBefore(value[1], "day"))
        );
      },
    },
    { title: "Heure", dataIndex: "heure" },
    { title: "Séquence", dataIndex: "sequence" },
    {
      title: "Projet",
      dataIndex: "projetNom",
      filters: [...new Set(allStockMouvement?.map((d) => d.projetNom))].map(
        (projet) => ({
          text: projet,
          value: projet,
        })
      ),
      onFilter: (value, record) => record.projetNom === value,
    },
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
          {record.statusMouvement === "Introduite" ? (
            <IoArrowForwardCircleOutline
              size={ICONSIZE.SMALL}
              color={COLORS.GREEN}
            />
          ) : (
            <IoArrowBackCircleOutline
              size={ICONSIZE.SMALL}
              color={COLORS.LearRed}
            />
          )}
          <span style={{ paddingLeft: "5px" }}>{text}</span>
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
            {data.length === 0 || sites.length === 0 ? (
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
                  <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                    Annuler
                  </Button>
                  <span
                    style={{
                      paddingLeft: "8px",
                    }}
                  ></span>
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
            {data.length === 0 || sites.length === 0 ? (
              <LoadingComponent height={true} header={true} />
            ) : (
              <Form layout="vertical" form={formAdmin} onFinish={onSubmitAdmin}>
                {/* Part Number */}
                <Form.Item
                  label="Part Number"
                  name="partNumber"
                  required={false}
                  rules={[
                    { required: true, message: "Saisie part number!" },
                    //   {
                    //     validator: (_, value) => {
                    //       if (!value || sequenceValid) return Promise.resolve();
                    //       return Promise.reject(new Error("Part number invalid"));
                    //     },
                    //   },
                  ]}
                >
                  <Input
                    style={{ height: "34px" }}
                    placeholder="Part Number"
                    onChange={handlePartNumberChangeAdmin}
                    maxLength={17}
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
                    onChange={handlePatternChangeAdmin}
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
                  <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                    Annuler
                  </Button>
                  <span
                    style={{
                      paddingLeft: "8px",
                    }}
                  ></span>
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
      <div style={{ padding: "10px 0px 15px 0px" }}>
        <h4 style={{ margin: "0px" }}>Gestion Stock</h4>
        <p style={{ margin: "0px", color: COLORS.Gray4 }}>
          Consultez, filtrez et gérez les mouvements de stock en temps réel
        </p>
      </div>
      <div style={{ paddingBottom: "13px" }}>
        <h6 style={{ margin: "0px" }}>Check Stock:</h6>
        {/* <p style={{ margin: "0px", color: COLORS.Gray4 }}>
          Consultez en un clic le stock de chaque Pattern associé à un Part
          Number.
        </p> */}
      </div>
      <Form
        style={{
          display: "flex",
          alignItems: "center",
        }}
        layout="vertical"
        form={formCheck}
      >
        <CardComponent width={"100%"} padding={"17px"}>
          {/* Part Number */}
          <Row gutter={24} justify={"space-around"}>
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                style={{
                  marginBottom: "0px",
                }}
                name="partNumber"
                rules={[
                  { required: true, message: "Saisie part number!" },
                  {
                    max: 17,
                    message: "Part number incorrect",
                  },
                ]}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingRight: "5px" }}>PN: </span>

                  <Input
                    placeholder="Part Number"
                    onChange={getPatterns}
                    style={{ height: "34px" }}
                    maxLength={17}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                style={{
                  marginBottom: "0px",
                }}
                name="patternNumb"
                rules={[{ required: true, message: "Saisie Pattern!" }]}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingRight: "5px" }}>Pattern: </span>
                  <Select
                    style={{ height: "34px", width: "100%" }}
                    onChange={(value) => {
                      const partNumber = formCheck.getFieldValue("partNumber");
                      if (value) {
                        checkStock(partNumber, value);
                      } else {
                        setStock("");
                      }
                    }}
                    placeholder="Sélectionnez pattern:"
                    allowClear
                  >
                    {patterns?.map((pat, i) => (
                      <Option key={i} value={patterns ? pat.patternNumb : ""}>
                        {pat.patternNumb}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                name="stock"
                style={{
                  marginBottom: "0px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingRight: "5px" }}>Stock: </span>
                  <Input
                    placeholder="Qte en stock"
                    style={{ height: "34px" }}
                    value={stock}
                    readOnly
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </CardComponent>
      </Form>
      <div style={{ paddingTop: "35px" }}>
        <h6 style={{ margin: "0px" }}>Mouvement Stock:</h6>
        {/* <p style={{ margin: "0px", color: COLORS.Gray4 }}>
          Consultez l’historique et le statut des mouvements de Patterns :
          Introduits ou livrés.
        </p> */}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "13px 0",
        }}
      >
        <Button onClick={showModal} color="danger" variant="outlined">
          Ajouter Pattern
        </Button>

        <Button type="primary" onClick={() => setIsExportModalOpen(true)}>
          Export Excel
        </Button>
      </div>

      {/* Table */}
      <Table
        rowClassName={() => "ant-row-no-hover"}
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
      <Modal
        title="Exporter Mouvement Stock"
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        onOk={() => exportToExcel()}
        okText="Exporter"
        cancelText="Annuler"
      >
        <RangePicker
          format="YYYY-MM-DD"
          value={exportDateRange}
          onChange={(dates) => setExportDateRange(dates)}
          style={{ width: "100%" }}
        />
      </Modal>
      <Modal
        title="Ajout Pattern"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        {roleList.includes("Admin") ? (
          <Tabs defaultActiveKey="1" items={items} />
        ) : (
          <>
            <div style={{ width: "100%" }}>
              {data.length === 0 || sites.length === 0 ? (
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
                </Form>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default GestionStock;
