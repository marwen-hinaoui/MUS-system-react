import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Segmented,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import SharedButton from "../../components/button/button";
import { COLORS } from "../../constant/colors";
import { get_all_mouvement_stock_api } from "../../api/get_all_mouvement_stock_api";
import { useDispatch, useSelector } from "react-redux";
import { ajout_stock_api } from "../../api/ajout_stock_api";
import { set_loading } from "../../redux/slices";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { MdOutlineFileDownload } from "react-icons/md";

import { get_patterns_api } from "../../api/plt/get_patterns_api";
import { ajout_stock_admin_api } from "../../api/ajout_stock_admin_api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import "./gestionStock.css";
import { get_seq_api } from "../../api/plt/get_seq_api";
import { get_material_api } from "../../api/plt/get_material_api";
import { get_projet_api } from "../../api/plt/get_projet_api";
import { CheckStock } from "./checkStock/checkStock";
import { get_stock_api } from "../../api/get_stock_api";
import { ExportExcel } from "./exportExcel/exportExcel";

const { Option } = Select;
const { RangePicker } = DatePicker;
const GestionStock = () => {
  const [form] = Form.useForm();
  const [formAdmin] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allStockMouvement, setAllStockMouvement] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [partNumbers, setPartNumbers] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [materialPartNumber, setMaterialPartNumber] = useState("");
  const token = useSelector((state) => state.app.tokenValue);
  const isLoading = useSelector((state) => state.app.isLoading);
  const roleList = useSelector((state) => state.app.roleList);
  const [projetNom, setProjet] = useState("");
  const [stockDATA, setStockDATA] = useState([]);

  const [exportDateRange, setExportDateRange] = useState([]);
  const [currentView, setCurrentView] = useState("Mouvement Stock");
  const id_userMUS = useSelector((state) => state.app.userId);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchStock();
    fetchStockAllQte();
  }, []);
  const fetchStockAllQte = async () => {
    try {
      const resStock = await get_stock_api(token);
      if (resStock.resData) {
        console.log(resStock.resData.data);
        setStockDATA(resStock.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  const exportSchema = [
    { header: "Id", dataIndex: "id" },
    { header: "Date", dataIndex: "date_creation" },
    { header: "Créateur de mvt", dataIndex: "mvt_create" },
    { header: "Heure", dataIndex: "heure" },
    { header: "Séquence", dataIndex: "sequence" },
    { header: "Projet", dataIndex: "projetNom" },
    { header: "Part Number", dataIndex: "partNumber" },
    { header: "Pattern", dataIndex: "patternNumb" },
    { header: "Matière", dataIndex: "partNumberMaterial" },
    { header: "Quantité", dataIndex: "quantite" },
    { header: "Statut Pattern", dataIndex: "statusMouvement" },
  ];

  const exportToExcel = (data) => {
    if (!data || data.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    let filteredData = data;
    const [start, end] = exportDateRange;

    if (exportDateRange && exportDateRange.length === 2) {
      filteredData = data.filter((item) => {
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

    const formattedData = filteredData.map((record) => {
      return exportSchema.reduce((obj, column) => {
        const key = column.dataIndex;
        obj[key] = record[key] || "";
        return obj;
      }, {});
    });

    const headers = exportSchema.map((col) => col.header);
    const headerKeys = exportSchema.map((col) => col.dataIndex);

    const worksheet = XLSX.utils.json_to_sheet(formattedData, {
      header: headerKeys,
    });

    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockMouvements");
    let fileName = "";
    if (!start || !end) {
      const today = new Date();
      const todayISO = today.toISOString().split("T")[0];
      fileName = `Stock_Mouvements_${todayISO}.xlsx`;
    } else {
      fileName = `Stock_Mouvements_${start?.$D}/${start?.$M + 1}/${
        start?.$y
      } - ${end?.$D}/${end?.$M + 1}/${end?.$y}.xlsx`;
    }

    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );
    saveAs(dataBlob, fileName);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSequenceChange = async (val) => {
    form.setFieldsValue({
      partNumber: undefined,
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
    });
    formAdmin.setFieldsValue({
      partNumber: undefined,
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
    });
    setPartNumbers([]);
    setMaterialPartNumber([]);
    setAvailablePatterns([]);
    try {
      if (val.length === 12) {
        const resPltSeq = await get_seq_api(val, token);
        console.log(resPltSeq);

        if (resPltSeq.resData?.length > 0) {
          setPartNumbers(resPltSeq.resData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePartNumberChange = async (value) => {
    console.log(value);

    const resPatterns = await get_patterns_api(value, token);
    console.log(resPatterns.resData);
    try {
      const resProjet = await get_projet_api(value, token);
      console.log(resProjet.resData.projet);

      setProjet(resProjet.resData.projet);
    } catch (error) {
      console.error("Failed to fetch project name:", error);
      setProjet("Erreur de chargement");
    }
    if (resPatterns.resData) {
      setAvailablePatterns(resPatterns.resData);
    }
    form.setFieldsValue({ patternNumb: undefined });
    setMaterialPartNumber("");
  };

  const handlePartNumberChangeAdmin = async (e) => {
    formAdmin.setFieldsValue({
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
    });
    setPartNumbers([]);
    setMaterialPartNumber([]);
    setAvailablePatterns([]);
    const partNumber = e.target.value;
    console.log(partNumber);

    if (partNumber.length >= 15) {
      const resPatterns = await get_patterns_api(partNumber, token);
      console.log(resPatterns.resData);

      try {
        const resProjet = await get_projet_api(partNumber, token);
        console.log(resProjet.resData.projet);

        setProjet(resProjet.resData.projet);
        if (resPatterns.resData) {
          setAvailablePatterns(resPatterns.resData);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error);
        setProjet("Erreur de chargement");
      }
    }

    form.setFieldsValue({});
  };

  const handlePatternChange = async (pattern) => {
    const partNumber = form.getFieldValue("partNumber");
    let material;
    try {
      const resMaterial = await get_material_api(partNumber, pattern, token);

      material = resMaterial.resData.part_number_material;
      setMaterialPartNumber(material);
    } catch (error) {
      console.log(error);
    }

    form.setFieldsValue({ materialPartNumber: material });
  };

  const handlePatternChangeAdmin = async (pattern) => {
    const partNumber = formAdmin.getFieldValue("partNumber");
    let material;

    try {
      const resMaterial = await get_material_api(partNumber, pattern, token);
      material = resMaterial.resData.part_number_material;
    } catch (error) {
      console.log(error);
    }

    formAdmin.setFieldsValue({ materialPartNumber: material });
  };

  const onSubmit = async (values) => {
    dispatch(set_loading(true));
    const piece = {
      id_userMUS,
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
    setPartNumbers([]);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    setIsModalOpen(false);
    fetchStockAllQte();
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
    setPartNumbers([]);
    setAvailablePatterns([]);
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
    {
      title: "Créateur de mvt",
      dataIndex: "mvt_create",
      filters: [...new Set(allStockMouvement?.map((d) => d.mvt_create))].map(
        (mvt) => ({
          text: mvt,
          value: mvt,
        })
      ),
      onFilter: (value, record) => record.mvt_create === value,
      filterSearch: true,
    },
    { title: "Heure", dataIndex: "heure" },
    {
      title: "Séquence",
      dataIndex: "sequence",
      filters: [...new Set(allStockMouvement?.map((d) => d.sequence))].map(
        (seq) => ({
          text: seq,
          value: seq,
        })
      ),
      onFilter: (value, record) => record.sequence === value,
      filterSearch: true,
    },
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
    {
      title: "Part Number",
      dataIndex: "partNumber",
      filters: [...new Set(allStockMouvement?.map((d) => d.partNumber))].map(
        (pn) => ({
          text: pn,
          value: pn,
        })
      ),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    {
      title: "Pattern",
      dataIndex: "patternNumb",
      filters: [...new Set(allStockMouvement?.map((d) => d.patternNumb))].map(
        (pattern) => ({
          text: pattern,
          value: pattern,
        })
      ),
      onFilter: (value, record) => record.patternNumb === value,
    },
    { title: "Matière", dataIndex: "partNumberMaterial" },
    { title: "Quantité", dataIndex: "quantite" },
    {
      title: "Statut Pattern",
      dataIndex: "statusMouvement",
      filters: [
        ...new Set(allStockMouvement?.map((d) => d.statusMouvement)),
      ].map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.statusMouvement === value,
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
            {
              <Form layout="vertical" form={form} onFinish={onSubmit}>
                {/* Sequence */}
                <Form.Item
                  label="Séquence"
                  name="sequence"
                  required={false}
                  rules={[
                    {
                      required: true,
                      message: "Le champ sequence est obligatoire !",
                    },
                    {
                      len: 12,
                      message: "La sequence doit contenir 12 chiffres !",
                    },
                  ]}
                >
                  <Input
                    style={{ height: "34px" }}
                    // value={sequence}
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
                    showSearch
                    placeholder="Select Part Number"
                    onChange={handlePartNumberChange}
                  >
                    {partNumbers.map((p) => (
                      <Option
                        key={p.cover_part_number}
                        value={p.cover_part_number}
                      >
                        {p.cover_part_number}
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
                    showSearch
                    placeholder="Select Pattern"
                    onChange={(val) => handlePatternChange(val)}
                    disabled={availablePatterns.length === 0}
                  >
                    {availablePatterns.map((pat, i) => (
                      <Option key={i} value={pat.panel_number}>
                        {pat.panel_number}
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
                  <Button
                    key="cancel"
                    onClick={() => {
                      formAdmin.resetFields();
                      setIsModalOpen(false);
                    }}
                  >
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
            }
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
            {
              <Form layout="vertical" form={formAdmin} onFinish={onSubmitAdmin}>
                {/* Part Number */}
                <Form.Item
                  label="Part Number"
                  name="partNumber"
                  required={false}
                  rules={[{ required: true, message: "Saisie part number!" }]}
                >
                  <Input
                    style={{ height: "34px" }}
                    placeholder="Part Number"
                    onChange={handlePartNumberChangeAdmin}
                    maxLength={19}
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
                    showSearch
                    placeholder="Select Pattern"
                    onChange={(val) => handlePatternChangeAdmin(val)}
                    disabled={availablePatterns.length === 0}
                  >
                    {availablePatterns.map((pat, i) => (
                      <Option key={i} value={pat.panel_number}>
                        {pat.panel_number}
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
            }
          </div>
        </>
      ),
    },
  ];
  const options = ["Mouvement Stock", "Check Stock"];
  return (
    <div>
      <div className="dashboard">
        {contextHolder}

        <Modal
          title="Ajout Pattern"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
            formAdmin.resetFields();
          }}
          footer={[]}
        >
          {roleList.includes("Admin") ? (
            <Tabs defaultActiveKey="1" items={items} />
          ) : (
            <>
              <div style={{ width: "100%" }}>
                {
                  <Form layout="vertical" form={form} onFinish={onSubmit}>
                    {/* Sequence */}
                    <Form.Item
                      label="Séquence"
                      name="sequence"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Le champ sequence est obligatoire !",
                        },
                        {
                          len: 12,
                          message: "La sequence doit contenir 12 chiffres !",
                        },
                      ]}
                    >
                      <Input
                        style={{ height: "34px" }}
                        // value={sequence}
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
                        showSearch
                        placeholder="Select Part Number"
                        onChange={(val) => handlePartNumberChange(val)}
                      >
                        {partNumbers.map((p) => (
                          <Option
                            key={p.cover_part_number}
                            value={p.cover_part_number}
                          >
                            {p.cover_part_number}
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
                        showSearch
                        placeholder="Select Pattern"
                        onChange={(val) => handlePatternChange(val)}
                        disabled={availablePatterns.length === 0}
                      >
                        {availablePatterns.map((pat, i) => (
                          <Option key={i} value={pat.panel_number}>
                            {pat.panel_number}
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
                      <Button
                        key="cancel"
                        onClick={() => {
                          form.resetFields();
                          setIsModalOpen(false);
                        }}
                      >
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
                }
              </div>
            </>
          )}
        </Modal>

        <div style={{ padding: "0px 0 16px 0px" }}>
          <h4 style={{ margin: "0px" }}>Gestion Stock</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              paddingBottom: "13px",
            }}
          >
            <Button onClick={showModal} color="danger" variant="outlined">
              Ajouter Pattern
            </Button>
          </div>
          <Segmented
            options={options}
            onChange={(value) => setCurrentView(value)}
            value={currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          />
          {currentView === "Check Stock" && (
            <ExportExcel stockDATA={stockDATA} />
          )}
          {currentView === "Mouvement Stock" && (
            <Button type="primary" onClick={() => setIsExportModalOpen(true)}>
              Export mvt stock <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
            </Button>
          )}
        </div>

        <div>
          {currentView === "Mouvement Stock" && (
            <div>
              <Table
                style={{
                  padding: "13px 0 0 0",
                }}
                rowClassName={() => "ant-row-no-hover"}
                bordered
                dataSource={allStockMouvement}
                columns={columns}
                pagination={{
                  position: ["bottomCenter"],
                  showSizeChanger: true,
                  defaultPageSize: "10",
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
            </div>
          )}
          {currentView === "Check Stock" && (
            <>
              <CheckStock
                stockDATA={stockDATA}
                refreshData={fetchStockAllQte}
              />
            </>
          )}
        </div>

        <Modal
          title="Exporter Mouvement Stock"
          open={isExportModalOpen}
          onCancel={() => setIsExportModalOpen(false)}
          onOk={() => exportToExcel(allStockMouvement)}
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
      </div>
    </div>
  );
};

export default GestionStock;
