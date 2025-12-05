import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popover,
  Segmented,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
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
import { MdOutlineContentCopy, MdOutlineFileDownload } from "react-icons/md";

import { get_patterns_api } from "../../api/plt/get_patterns_api";
import { ajout_stock_admin_api } from "../../api/ajout_stock_admin_api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleSharp,
} from "react-icons/io5";
import "./gestionStock.css";
import { get_seq_api } from "../../api/plt/get_seq_api";
import { get_material_api } from "../../api/plt/get_material_api";
import { get_projet_api } from "../../api/plt/get_projet_api";
import { get_bin_from_projet_api } from "../../api/get_bin_from_projet_api";
import { CheckStock } from "../../components/checkStock/checkStock";
import { get_stock_api } from "../../api/get_stock_api";
import { ExportExcel } from "../../components/checkStock/components/exportExcel";
import { ExcelReader } from "../../components/excelReader/excelReader";
import { ajout_stock_admin_leather_api } from "../../api/ajout_stock_admin_leather_api";
import { get_pn_from_kit_leather_api } from "../../api/plt/get_pn_from_kit_leather_api";
import { get_bin_from_pattern_api } from "../../api/get_bin_from_pattern_api";
import { RxCheckCircled } from "react-icons/rx";
import { get_bin_from_pattern_api_livree } from "../../api/get_bin_from_pattern_api_livree";
import { CheckStatusBin } from "../../components/CheckStatusBin/CheckStatusBin";
import { get_all_bins_api } from "../../api/get_all_bins_api";

const { Option } = Select;
const { RangePicker } = DatePicker;
const GestionStock = () => {
  const [form] = Form.useForm();
  const [formAdmin] = Form.useForm();
  const [formAdminKitLeather] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastComfirmBinPlein, setLastComfirmBinPlein] = useState(false);
  const [binPlein, setBinPlein] = useState(false);
  const [currentKey, setCurrentKey] = useState({});
  const [allStockMouvement, setAllStockMouvement] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [partNumbers, setPartNumbers] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [materialPartNumber, setMaterialPartNumber] = useState("");
  const token = useSelector((state) => state.app.tokenValue);
  const site = useSelector((state) => state.app.site);
  const isLoading = useSelector((state) => state.app.isLoading);
  const roleList = useSelector((state) => state.app.roleList);
  const [projetNom, setProjet] = useState("");
  const [binCode, setBinCode] = useState(""); // Old bin : will be Plein
  const [binCodePlein, setBinCodePlein] = useState(""); // New bin
  const [partNumberFrommKitLeather, setPartNumberFrommKitLeather] =
    useState("");
  const [stockDATA, setStockDATA] = useState([]);
  const [binStorage, setBinStorage] = useState([]);
  const [selectedBin, setSelectedBin] = useState({});
  const [binData, setBinData] = useState([]);
  const [binStatus, setBinStatus] = useState(false);

  const [exportDateRange, setExportDateRange] = useState([]);
  const [beforeComfirmBinPlein, setBeforeComfirmBinPlein] = useState(false);
  const [currentView, setCurrentView] = useState("Mouvement Stock");
  const [partNumber, setPartNumber] = useState("");
  const [patternNumb, setPatternNumb] = useState("");
  const id_userMUS = useSelector((state) => state.app.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchStock();
    fetchStockAllQte();
    fetchAllBins();
    console.log(site);
  }, []);

  const fetchAllBins = async () => {
    const resBins = await get_all_bins_api(token);
    setBinData(resBins?.resData?.data);
  };
  const fetchStockAllQte = async () => {
    try {
      const resStock = await get_stock_api(token);
      if (resStock.resData) {
        setStockDATA(resStock.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBinsStorate = async (partNumber, pattern) => {
    try {
      const resBinFromPattern = await get_bin_from_pattern_api(
        partNumber,
        pattern,
        id_userMUS,
        token
      );
      setBinStorage(resBinFromPattern?.resData?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPlein = () => {
    fetchBinsStorate(partNumber, patternNumb, token);
  };

  const fetchBinFromProjet = async () => {
    try {
      const resBinFromProjet = await get_bin_from_projet_api(
        projetNom,
        binCode,
        id_userMUS,
        token
      );

      form.resetFields(["bin"]);
      formAdmin.resetFields(["bin"]);
      formAdminKitLeather.resetFields(["bin"]);

      setBinStorage(resBinFromProjet?.resData?.data);
      setBinPlein(false);
      setLastComfirmBinPlein(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStock = async () => {
    try {
      const resStock = await get_all_mouvement_stock_api(token);
      if (resStock.resData) {
        setAllStockMouvement(resStock?.resData?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportSchema = [
    { header: "Id", dataIndex: "id" },
    { header: "Numero MUS", dataIndex: "numDemande", width: 60 },
    { header: "Créateur de mvt", dataIndex: "mvt_create" },
    { header: "Emetteur", dataIndex: "Emetteur", width: 60 },
    { header: "Date", dataIndex: "date_creation" },
    { header: "Heure", dataIndex: "heure" },
    { header: "Séquence", dataIndex: "sequence" },
    { header: "Projet", dataIndex: "projetNom" },
    { header: "Part Number", dataIndex: "partNumber" },
    { header: "Pattern", dataIndex: "patternNumb" },
    { header: "Matière", dataIndex: "partNumberMaterial" },
    { header: "Quantité", dataIndex: "quantite" },
    {
      header: "Site",
      dataIndex: "site",
    },
    { header: "Statut Pattern", dataIndex: "statusMouvement" },
  ];

  const exportToExcel = (data) => {
    if (!data || data.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    let filteredData = data;
    const [start, end] = exportDateRange;

    if (exportDateRange && exportDateRange?.length === 2) {
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
  const hanleCloseModal = () => {
    setLastComfirmBinPlein(false);
    formAdmin.resetFields();
    form.resetFields();
    formAdminKitLeather.resetFields();
    setPartNumbers([]);
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    setIsModalOpen(false);
  };
  const handleSequenceChange = async (val) => {
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setSelectedBin("");
    form.setFieldsValue({
      partNumber: undefined,
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
      bin: undefined,
    });

    setPartNumbers([]);
    setMaterialPartNumber([]);
    setAvailablePatterns([]);
    try {
      if (val.length === 12) {
        const resPltSeq = await get_seq_api(val, token);
        console.log(resPltSeq);

        if (resPltSeq?.resData?.length > 0) {
          setPartNumbers(resPltSeq?.resData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePartNumberChange = async (value) => {
    console.log(value);
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    form.setFieldsValue({
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
      bin: undefined,
    });
    setPartNumber("");
    setPatternNumb("");
    const resPatterns = await get_patterns_api(value, token);
    console.log(resPatterns?.resData);
    try {
      const resProjet = await get_projet_api(value, token);
      console.log(resProjet?.resData?.projet);

      setProjet(resProjet?.resData?.projet);
    } catch (error) {
      console.error("Failed to fetch project name:", error);
      setProjet("Erreur de chargement");
    }
    if (resPatterns?.resData) {
      setAvailablePatterns(resPatterns?.resData);
    }
    form.setFieldsValue({ patternNumb: undefined });
    setMaterialPartNumber("");
  };

  const handlePartNumberChangeAdmin = async (e) => {
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    formAdmin.setFieldsValue({
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
      bin: undefined,
    });
    setPartNumbers([]);
    setMaterialPartNumber([]);
    setAvailablePatterns([]);
    const partNumber = e.target.value;
    console.log(partNumber);
    setPartNumber("");
    setPatternNumb("");
    if (partNumber.length >= 15) {
      const resPatterns = await get_patterns_api(partNumber, token);
      console.log(resPatterns?.resData);

      try {
        const resProjet = await get_projet_api(partNumber, token);
        console.log(resProjet?.resData?.projet);

        setProjet(resProjet?.resData?.projet);
        if (resPatterns?.resData) {
          setAvailablePatterns(resPatterns?.resData);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error);
        setProjet("Erreur de chargement");
      }
    }

    form.setFieldsValue({});
  };

  const handleKitLeatherPartNumberChangeAdmin = async (e) => {
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setPartNumbers([]);
    setMaterialPartNumber([]);
    setAvailablePatterns([]);
    formAdminKitLeather.setFieldsValue({
      projetNom: undefined,
      patternNumb: undefined,
      materialPartNumber: undefined,
      bin: undefined,
    });
    const kit_leather_pn = e.target.value;
    console.log(kit_leather_pn);
    setPartNumber("");
    setPatternNumb("");
    try {
      if (kit_leather_pn.length >= 15) {
        const resPn = await get_pn_from_kit_leather_api(kit_leather_pn, token);
        setPartNumberFrommKitLeather(resPn?.resData[0]?.part_number_cover);
        formAdminKitLeather.setFieldsValue({
          partNumberCoiff: resPn?.resData[0]?.part_number_cover,
        });
        const resProjet = await get_projet_api(
          resPn?.resData[0]?.part_number_cover,
          token
        );
        console.log(resProjet?.resData?.projet);

        setProjet(resProjet?.resData?.projet);
        const resPatterns = await get_patterns_api(
          resPn?.resData[0]?.part_number_cover,
          token
        );
        formAdminKitLeather.setFieldValue({
          patternNumb: resPatterns?.resData,
        });
        setAvailablePatterns(resPatterns?.resData);
      }
    } catch (error) {
      console.error("Failed to fetch Part Number from Kit Leather:", error);
    }
  };

  const handlePatternChange = async (pattern) => {
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setSelectedBin({});
    form.setFieldsValue({
      bin: undefined,
    });
    const partNumber = form.getFieldValue("partNumber");
    setPartNumber(partNumber);
    setPatternNumb(pattern);
    let material;
    try {
      const resMaterial = await get_material_api(partNumber, pattern, token);
      fetchBinsStorate(partNumber, pattern);
      material = resMaterial?.resData?.part_number_material;
      setMaterialPartNumber(material);
    } catch (error) {
      console.log(error);
    }

    form.setFieldsValue({ materialPartNumber: material });
  };

  const handlePatternChangeAdmin = async (pattern) => {
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setSelectedBin({});
    formAdmin.setFieldsValue({
      bin: undefined,
    });
    const partNumber = formAdmin.getFieldValue("partNumber");
    setPartNumber(partNumber);
    setPatternNumb(pattern);
    let material;

    try {
      const resMaterial = await get_material_api(partNumber, pattern, token);
      material = resMaterial?.resData?.part_number_material;

      fetchBinsStorate(partNumber, pattern);
    } catch (error) {
      console.log(error);
    }

    formAdmin.setFieldsValue({ materialPartNumber: material });
  };

  const handlePatternKitLeatherChangeAdmin = async (pattern) => {
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setSelectedBin({});
    formAdminKitLeather.setFieldsValue({
      bin: undefined,
    });
    const partNumber = formAdminKitLeather.getFieldValue("partNumberCoiff");
    setPartNumber(partNumber);
    setPatternNumb(pattern);

    let material;

    try {
      const resMaterial = await get_material_api(partNumber, pattern, token);
      material = resMaterial?.resData?.part_number_material;

      fetchBinsStorate(partNumber, pattern);
    } catch (error) {
      console.log(error);
    }

    formAdminKitLeather.setFieldsValue({ materialPartNumber: material });
  };

  const onSubmit = async (values) => {
    formAdminKitLeather.resetFields();
    formAdmin.resetFields();

    dispatch(set_loading(true));
    const piece = {
      id_userMUS,
      projetNom: projetNom,
      sequence: values.sequence,
      partNumber: values.partNumber,
      patternNumb: values.patternNumb,
      partNumberMaterial: values.materialPartNumber,
      quantiteAjouter: values.quantite,
      bin_code: binCode,
      Emetteur: values.Emetteur,
      bin_code_plein: binCodePlein,
    };

    const resAjout = await ajout_stock_api(piece, token);
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout?.resData?.message);
      fetchAllBins();
      fetchStockAllQte();

      fetchStock();
    } else {
      console.log(resAjout?.resError?.response?.data?.message);
    }
    form.resetFields();
    setPartNumbers([]);
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    setIsModalOpen(false);
    dispatch(set_loading(false));
  };

  const onSubmitAdmin = async (values) => {
    formAdminKitLeather.resetFields();
    form.resetFields();
    dispatch(set_loading(true));
    const piece = {
      id_userMUS,
      projetNom: projetNom,
      sequence: "N/A",
      partNumber: values.partNumber,
      patternNumb: values.patternNumb,
      partNumberMaterial: values.materialPartNumber,
      quantiteAjouter: values.quantite,
      bin_code: binCode,
      bin_code_plein: binCodePlein,
      Emetteur: values.Emetteur,
    };
    console.log(piece);

    const resAjout = await ajout_stock_admin_api(piece, token);
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout?.resData?.message);
      setIsModalOpen(false);
      fetchStockAllQte();
      fetchAllBins();
      fetchStock();
    } else {
      console.log(resAjout?.resError?.response?.data?.message);
    }
    formAdmin.resetFields();
    setPartNumbers([]);
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    dispatch(set_loading(false));
  };

  const onSubmitAdminKitLeather = async (values) => {
    console.log(values.bin);

    dispatch(set_loading(true));
    form.resetFields();
    formAdmin.resetFields();
    const piece = {
      id_userMUS,
      projetNom: projetNom,
      sequence: "N/A",
      partNumberCoiff: values.partNumberCoiff,
      kitLeatherPartNumber: values.kitLeatherPartNumber,
      patternNumb: values.patternNumb,
      partNumberMaterial: values.materialPartNumber,
      quantiteAjouter: values.quantite,
      bin_code: binCode,
      bin_code_plein: binCodePlein,
      Emetteur: values.Emetteur,
    };
    console.log(piece);

    const resAjout = await ajout_stock_admin_leather_api(piece, token);
    if (resAjout.resData) {
      openNotificationSuccess(api, resAjout?.resData?.message);
      setIsModalOpen(false);
      fetchStockAllQte();
      fetchAllBins();
      fetchStock();
    } else {
      console.log(resAjout?.resError?.response?.data?.message);
    }
    formAdminKitLeather.resetFields();
    setPartNumbers([]);
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");

    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
    dispatch(set_loading(false));
  };

  const columns = [
    { title: "Id", dataIndex: "id" },
    {
      title: "Numero MUS",
      dataIndex: "numDemande",
      width: 100,
      filters: [...new Set(allStockMouvement?.map((d) => d.numDemande))].map(
        (_numDemande) => ({
          text: _numDemande,
          value: _numDemande,
        })
      ),
      onFilter: (value, record) => record.numDemande === value,
      filterSearch: true,
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
    {
      title: "Emetteur",
      dataIndex: "Emetteur",
      dataIndex: "Emetteur",
      filters: [...new Set(allStockMouvement?.map((d) => d.Emetteur))].map(
        (_Emetteur) => ({
          text: _Emetteur,
          value: _Emetteur,
        })
      ),
      onFilter: (value, record) => record.Emetteur === value,
      filterSearch: true,
    },

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
      render: (text, record) => {
        return <div>{text === "N/A" ? <p>{text}</p> : <p>{text}</p>}</div>;
      },
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
      title: "Pattern N°",
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
      title: "Bin de stockage",
      dataIndex: "bin_code",
    },
    {
      title: "Site",
      dataIndex: "site",
      filters: [...new Set(stockDATA?.map((d) => d.site))].map((site) => ({
        text: site,
        value: site,
      })),
      onFilter: (value, record) => record.projetNom === value,
    },
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

  const binOptions = React.useMemo(() =>
    binStorage?.map((p) => ({
      label: () => (
        <Typography.Text
          className="copyLine"
          copyable={{
            icon: <MdOutlineContentCopy color={COLORS.Gray4} />,
            text: `${p.bin_code} -> ${p.status}`,
            tooltips: ["Copier", "Copié!"],
          }}
        >
          {`${p.bin_code} -> ${p.status}`}
        </Typography.Text>
      ),
      value: p.id,
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
    }))
  );

  const handleChange = (value, option) => {
    const _selectedBin = binStorage.find((b) => b.id === value);
    const isPleinOrReserve =
      option?.status === "Vide" || option?.status === "Réservé";
    setBeforeComfirmBinPlein(isPleinOrReserve);
    !lastComfirmBinPlein && setBinCode(_selectedBin?.bin_code);
    lastComfirmBinPlein && setBinCodePlein(_selectedBin?.bin_code);
    _selectedBin?.status === "Réservé" && setBinStatus(true);
    _selectedBin?.status === "Vide" && setBinStatus(false);
    setSelectedBin(`${_selectedBin?.bin_code} -> ${_selectedBin?.status}`);
  };

  const BinPleinComponent = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px 0 0 0",
          marginBottom: "17px",
        }}
      >
        {binStatus && (
          <p
            style={{
              cursor: "pointer",
              width: "auto",
              color: COLORS.LearRed,
              textDecoration: "underline",
              display: "inline-block",
            }}
            onClick={() => {
              if (!lastComfirmBinPlein) {
                setBinPlein(true);
                setBinCodePlein("");
              }
            }}
          >
            Le bin est-il plein?
          </p>
        )}
        {binPlein && (
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                padding: "0 4px",
              }}
            >
              <Button
                style={{
                  padding: "7px",
                  border: "none",
                  background: COLORS.LearRed,
                  color: COLORS.WHITE,
                }}
                onClick={() => {
                  setBinPlein(false);
                  handleCancelPlein();
                }}
              >
                <IoCloseCircleOutline size={ICONSIZE.SMALL} /> Non
              </Button>
            </div>
            <Button
              style={{
                padding: "7px",
                border: "none",
                background: COLORS.GREEN,
                color: COLORS.WHITE,
              }}
              onClick={() => fetchBinFromProjet()}
            >
              <RxCheckCircled size={ICONSIZE.SMALL - 1} /> Oui
            </Button>
          </div>
        )}
        {lastComfirmBinPlein && (
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                padding: "0 4px",
              }}
            >
              <Button
                style={{
                  padding: "7px",
                  border: "none",
                  background: COLORS.LearRed,
                  color: COLORS.WHITE,
                }}
                onClick={() => {
                  setBinPlein(false);
                  setLastComfirmBinPlein(false);

                  form.resetFields(["bin"]);
                  formAdmin.resetFields(["bin"]);
                  formAdminKitLeather.resetFields(["bin"]);
                  handleCancelPlein();
                  setBeforeComfirmBinPlein(false);
                }}
              >
                <IoCloseCircleOutline size={ICONSIZE.SMALL} /> Annuler
              </Button>
            </div>
            <Button
              disabled={binCodePlein === ""}
              style={{
                padding: "7px",
                border: "none",
                background:
                  binCodePlein !== "" ? COLORS.GREEN : "rgb(55 138 58 / 71%)",
                color: COLORS.WHITE,
              }}
              onClick={() => updateBinStatus()}
            >
              <RxCheckCircled size={ICONSIZE.SMALL - 1} /> Confirmer
            </Button>
          </div>
        )}
      </div>
    );
  };

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
                    disabled={partNumbers.length === 0}
                  >
                    {partNumbers.map((p) => (
                      <Option
                        key={p.cover_part_number}
                        value={p.cover_part_number}
                      >
                        <Typography.Text
                          className="copyLine"
                          copyable={{
                            icon: <MdOutlineContentCopy color={COLORS.Gray4} />,
                            text: p.cover_part_number,
                            tooltips: ["Copier", "Copié!"],
                          }}
                        >
                          {p.cover_part_number}
                        </Typography.Text>
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
                        <Typography.Text
                          className="copyLine"
                          copyable={{
                            icon: <MdOutlineContentCopy color={COLORS.Gray4} />,
                            text: pat.panel_number,
                            tooltips: ["Copier", "Copié!"],
                          }}
                        >
                          {pat.panel_number}
                        </Typography.Text>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Material */}
                <Form.Item label="Matière" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>

                {/* Bin */}
                <Form.Item
                  label="Bin de stockage"
                  name="bin"
                  required={false}
                  style={{
                    marginBottom: beforeComfirmBinPlein && "0px",
                  }}
                  rules={[
                    { required: true, message: "Choisir bin de stockage!" },
                  ]}
                >
                  <Select
                    value={selectedBin}
                    placeholder="Select Bin de stockage"
                    onChange={handleChange}
                    disabled={binStorage?.length === 0}
                    style={{
                      padding: "0px",
                    }}
                    options={binOptions}
                  />
                </Form.Item>
                <div>{beforeComfirmBinPlein && <BinPleinComponent />}</div>

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

                {/* Emetteur */}
                <Form.Item
                  required={false}
                  label="Emetteur"
                  name="Emetteur"
                  rules={[{ required: true, message: "Saisie Emetteur!" }]}
                >
                  <Input style={{ width: "100%", height: "34px" }} />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button key="cancel" onClick={hanleCloseModal}>
                    Annuler
                  </Button>
                  <span
                    style={{
                      paddingLeft: "8px",
                    }}
                  ></span>
                  <SharedButton
                    loading={isLoading}
                    disabled={lastComfirmBinPlein}
                    type="primary"
                    name="Enregistrer"
                    color={
                      lastComfirmBinPlein
                        ? "rgb(238 49 36 / 70%)"
                        : COLORS.LearRed
                    }
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
                        <Typography.Text
                          className="copyLine"
                          copyable={{
                            icon: <MdOutlineContentCopy color={COLORS.Gray4} />,
                            text: pat.panel_number,
                            tooltips: ["Copier", "Copié!"],
                          }}
                        >
                          {pat.panel_number}
                        </Typography.Text>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Material */}
                <Form.Item label="Matière" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>

                {/* Bin */}
                <Form.Item
                  label="Bin de stockage"
                  name="bin"
                  required={false}
                  rules={[
                    { required: true, message: "Choisir bin de stockage!" },
                  ]}
                  style={{
                    marginBottom: beforeComfirmBinPlein && "0px",
                  }}
                >
                  <Select
                    value={selectedBin}
                    placeholder="Select Bin de stockage"
                    onChange={handleChange}
                    disabled={binStorage?.length === 0}
                    style={{
                      padding: "0px",
                    }}
                    options={binOptions}
                  />
                </Form.Item>
                <div>{beforeComfirmBinPlein && <BinPleinComponent />}</div>
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
                {/* Emetteur */}
                <Form.Item
                  required={false}
                  label="Emetteur"
                  name="Emetteur"
                  rules={[{ required: true, message: "Saisie Emetteur!" }]}
                >
                  <Input style={{ width: "100%", height: "34px" }} />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button key="cancel" onClick={hanleCloseModal}>
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
      key: "3",
      label: "Kit Leather PN",
      children: (
        <>
          <div style={{ width: "100%" }}>
            {
              <Form
                layout="vertical"
                form={formAdminKitLeather}
                onFinish={onSubmitAdminKitLeather}
              >
                {/* Part Number */}
                <Form.Item
                  label="Kit Leather PN"
                  name="kitLeatherPartNumber"
                  required={false}
                  rules={[
                    {
                      required: true,
                      message: "Saisie part number kit leather!",
                    },
                  ]}
                >
                  <Input
                    style={{ height: "34px" }}
                    placeholder="Part Number Kit Leather"
                    onChange={handleKitLeatherPartNumberChangeAdmin}
                    maxLength={19}
                  />
                </Form.Item>
                <Form.Item label="Coiffe PN" name="partNumberCoiff">
                  <Input value={partNumberFrommKitLeather} readOnly />
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
                    onChange={(val) => handlePatternKitLeatherChangeAdmin(val)}
                    disabled={availablePatterns.length === 0}
                  >
                    {availablePatterns.map((pat, i) => (
                      <Option key={i} value={pat.panel_number}>
                        <Typography.Text
                          className="copyLine"
                          copyable={{
                            icon: <MdOutlineContentCopy color={COLORS.Gray4} />,
                            text: pat.panel_number,
                            tooltips: ["Copier", "Copié!"],
                          }}
                        >
                          {pat.panel_number}
                        </Typography.Text>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Material */}
                <Form.Item label="Matière" name="materialPartNumber">
                  <Input value={materialPartNumber} readOnly />
                </Form.Item>

                {/* Bin */}
                <Form.Item
                  label="Bin de stockage"
                  name="bin"
                  required={false}
                  style={{
                    marginBottom: beforeComfirmBinPlein && "0px",
                  }}
                  rules={[
                    { required: true, message: "Choisir bin de stockage!" },
                  ]}
                >
                  <Select
                    value={selectedBin}
                    placeholder="Select Bin de stockage"
                    onChange={handleChange}
                    disabled={binStorage?.length === 0}
                    style={{
                      padding: "0px",
                    }}
                    options={binOptions}
                  />
                </Form.Item>
                <div>{beforeComfirmBinPlein && <BinPleinComponent />}</div>

                {/* {binCodePlein === "" && (
                  <p>
                    <b>NOTE:</b>
                    test
                  </p>
                )} */}

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
                {/* Emetteur */}
                <Form.Item
                  required={false}
                  label="Emetteur"
                  name="Emetteur"
                  rules={[{ required: true, message: "Saisie Emetteur!" }]}
                >
                  <Input style={{ width: "100%", height: "34px" }} />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button key="cancel" onClick={hanleCloseModal}>
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

  const handleTabChangeTabsItems = async (e) => {
    setCurrentKey(e);
    setLastComfirmBinPlein(false);
    formAdmin.resetFields();
    form.resetFields();
    formAdminKitLeather.resetFields();
    setPartNumbers([]);
    setBinStorage([]);
    setBinCode("");
    setBinCodePlein("");
    setBeforeComfirmBinPlein(false);
    setBinPlein(false);
    setAvailablePatterns([]);
    setMaterialPartNumber("");
  };

  const updateBinStatus = async () => {
    setLastComfirmBinPlein(false);
    setBeforeComfirmBinPlein(false);
    console.log("-----binCode----");
    console.log(binCode, " ", binCodePlein, " ", partNumber, " ", patternNumb);
  };

  const options = ["Mouvement Stock", "Check Stock", "Check Bin"];
  return (
    <div>
      <div className="dashboard">
        {contextHolder}

        <Modal
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: FONTSIZE.PRIMARY,
                    fontWeight: 600,
                  }}
                >
                  Ajout Pattern
                </span>

                {/* <Popover
                  placement="right"
                  content={
                    <div style={{ maxWidth: "300px" }}>
                      Veuillez choisir si vous désirez insérer le Pattern par{" "}
                      <b>Sequence</b>, par <b>Coiffe PN</b> ou par{" "}
                      <b>Kit Leather PN</b>.
                    </div>
                  }
                >
                  <IoInformationCircleSharp
                    size={ICONSIZE.SMALL}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Popover> */}
              </div>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#555",
                }}
              ></span>
            </div>
          }
          closable
          open={isModalOpen}
          onCancel={hanleCloseModal}
          footer={[]}
        >
          {(roleList.includes("Admin") ||
            roleList.includes("GESTIONNAIRE_STOCK") ||
            roleList.includes("AGENT_MUS")) && (
            <Tabs
              defaultActiveKey="1"
              onChange={handleTabChangeTabsItems}
              items={items}
            />
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ExcelReader
                fetchFunction={fetchStockAllQte}
                fetchMouvement={fetchStock}
                fetchAllBins={fetchAllBins}
                stockDATA={[...stockDATA]}
              />
              <ExportExcel isBin={false} stockDATA={[...stockDATA]} />
            </div>
          )}
          {currentView === "Mouvement Stock" && (
            <Button type="primary" onClick={() => setIsExportModalOpen(true)}>
              Excel Export <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
            </Button>
          )}
          {currentView === "Check Bin" && (
            <ExportExcel stockDATA={[...binData]} isBin={true} />
          )}
        </div>

        <div>
          {currentView === "Mouvement Stock" && (
            <div>
              <Table
                style={{
                  padding: "13px 0 0 0",
                }}
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
                    // <Empty
                    //   description="Aucune donnée trouvée"
                    //   image={Empty.PRESENTED_IMAGE_SIMPLE}
                    // />
                    <p>Aucune donnée trouvée</p>
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
          {currentView === "Check Bin" && (
            <>
              <CheckStatusBin binData={binData} />
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
