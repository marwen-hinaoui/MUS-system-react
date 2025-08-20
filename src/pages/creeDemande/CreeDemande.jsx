import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Form,
  Table,
  notification,
  Breadcrumb,
  Tooltip,
  Empty,
  InputNumber,
  Col,
  Row,
} from "antd";
import CardComponent from "../../components/card/cardComponent";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import {
  MdDelete,
  MdOutlineLibraryAdd,
  MdOutlineNumbers,
} from "react-icons/md";
import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import SharedButton from "../../components/button/button";
import { get_project } from "../../api/get_project";
import { get_sites } from "../../api/get_sites";
import { get_lieuDetection } from "../../api/get_lieuDetection";
import { create_demande_api } from "../../api/create_demande_api";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCheckmarkCircle } from "react-icons/io";
import LaodingComponent from "../../components/loadingComponent/loadingComponent";

const { Option } = Select;
const breadcrumb = [
  {
    title: <RiDashboardHorizontalLine />,
  },

  {
    title: <Link to={"/admin"}>Dashboard</Link>,
  },
  {
    title: "Creation demande",
  },
];
const CreeDemande = () => {
  const [data, setData] = useState(null);
  const [projects, setProjetcs] = useState(null);
  const [sites, setSites] = useState(null);
  const [lieuDetection, setLieuDetection] = useState(null);
  const [sequence, setSequence] = useState("");
  const [sequenceValid, setSequenceValid] = useState(false);
  const [subDemandes, setSubDemandes] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [demande, setDemande] = useState({});
  const token = useSelector((state) => state.app.tokenValue);
  const id_userMUS = useSelector((state) => state.app.userId);

  useEffect(() => {
    fetch("/cms.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch JSON:", err));
    fetchTrim();
  }, []);

  const fetchTrim = async () => {
    const resProjet = await get_project();
    setProjetcs(resProjet.resData.data);

    const resSites = await get_sites();
    setSites(resSites.resData.data);

    const resLieu = await get_lieuDetection();
    setLieuDetection(resLieu.resData.data);
  };

  if (!data || !projects || !sites || !lieuDetection)
    return <LaodingComponent />;

  // validate sequence
  const handleSequenceChange = (val) => {
    setSequence(val);
    if (/^\d{12}$/.test(val)) {
      const exists = data.CMS.some((c) => c.sequence === val);
      setSequenceValid(exists);
      if (exists) {
        setSubDemandes([
          {
            key: Date.now(),
            partNumber: "",
            pattern: "",
            material: "",
            quantite: "",
          },
        ]);
      } else if (val.length === 12) {
        setSubDemandes([]);
      }
    } else {
      setSequenceValid(false);
      setSubDemandes([]);
    }
  };

  const partNumbers =
    data.CMS.find((c) => c.sequence === sequence)?.partNumbers || [];

  const materialsMap = data.Materials[0];

  const handleAddRow = () => {
    setSubDemandes((prev) => [
      ...prev,
      {
        key: Date.now(),
        partNumber: "",
        pattern: "",
        quantite: "",
      },
    ]);
  };

  // Update row ---------------------------------------------------------------
  const handleChange = (key, field, value) => {
    setSubDemandes((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;

        const updatedRow = { ...row };

        if (field === "defaut") {
          updatedRow.code_defaut = value.code_defaut;
          updatedRow.typeDefaut = value.typeDefaut;
        } else {
          updatedRow[field] = value;
        }

        if (field === "pattern") {
          const partObj = partNumbers.find(
            (p) => p.partNumber === updatedRow.partNumber
          );
          const partMaterials = partObj?.materials || [];
          const matchedMaterial =
            partMaterials.find((mat) =>
              materialsMap[mat]?.includes(Number(value))
            ) || "";
          updatedRow.material = matchedMaterial;
        }

        return updatedRow;
      })
    );
  };

  // Delete row ---------------------------------------------------------------

  const handleDelete = (key) => {
    setSubDemandes((prev) => prev.filter((row) => row.key !== key));
  };

  const columns = [
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text, record) => (
        <Select
          value={record.partNumber || undefined}
          placeholder="Select Part Number"
          onChange={(val) => handleChange(record.key, "partNumber", val)}
          showSearch
          optionFilterProp="children"
          style={{ width: "100%", height: "34px" }}
        >
          {partNumbers.map((p) => (
            <Option key={p.partNumber} value={p.partNumber}>
              {p.partNumber}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Pattern",
      dataIndex: "pattern",
      key: "pattern",
      render: (text, record) => {
        const partObj = partNumbers.find(
          (p) => p.partNumber === record.partNumber
        );
        const partMaterials = partObj?.materials || [];
        let availablePatterns = [];
        partMaterials.forEach((mat) => {
          if (materialsMap[mat])
            availablePatterns = [...availablePatterns, ...materialsMap[mat]];
        });

        return (
          <Select
            value={record.pattern || undefined}
            placeholder="Select Pattern"
            onChange={(val) => handleChange(record.key, "pattern", val)}
            disabled={!record.partNumber}
            showSearch
            optionFilterProp="children"
            style={{ width: "100%", height: "34px" }}
          >
            {availablePatterns.map((pat, i) => (
              <Option key={i} value={pat}>
                {pat}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      render: (text, record) => (
        <Input
          style={{ width: "100%", height: "34px" }}
          value={record.material}
          readOnly
        />
      ),
    },
    {
      title: "Defaut",
      dataIndex: "defaut",
      key: "defaut",
      render: (text, record) => (
        <Select
          value={record.code_defaut || undefined}
          placeholder="Select defaut"
          onChange={(val, option) =>
            handleChange(record.key, "defaut", {
              code_defaut: val,
              typeDefaut: option.typeDefaut,
            })
          }
          showSearch
          optionFilterProp="children"
          style={{ width: "100%", height: "34px" }}
        >
          {data.DefautCMS.map((def) => (
            <Option
              key={def.code_defaut}
              value={def.code_defaut}
              typeDefaut={def.typeDefaut}
            >
              {`${def.code_defaut} (${def.typeDefaut})`}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text, record) => (
        <InputNumber
          min={0}
          max={999}
          // style={{ padding: "3px" }}
          style={{ width: "100%", height: "34px" }}
          onChange={(val) => handleChange(record.key, "quantite", val)}
          value={record.quantite}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record, index) => {
        const onlyOneRow = subDemandes.length === 1;
        return (
          <Tooltip title="Supprimer sub demande">
            <MdDelete
              style={{
                cursor: "pointer",
              }}
              color={COLORS.LearRed}
              size={ICONSIZE.SMALL}
              onClick={() => handleDelete(record.key)}
              disabled={onlyOneRow}
            />
          </Tooltip>
          // </Button>
        );
      },
    },
  ];

  const handleSelectChange = (field, value) => {
    setDemande((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    if (!sequenceValid) {
      // openNotification(api, "Sequance incorrect!");
      return;
    }

    if (
      subDemandes.some(
        (row) =>
          !row.partNumber ||
          !row.pattern ||
          !row.material ||
          !row.code_defaut ||
          !row.quantite
      )
    ) {
      openNotification(
        api,
        "Veillez saisie Part number, pattern, defaut, quantite"
      );
      return;
    }
    const cleanSubDemandes = subDemandes.map(({ key, ...rest }) => rest);
    const demandeToSubmit = {
      id_userMUS: id_userMUS,
      id_site: demande.id_site,
      id_projet: demande.id_projet,
      id_lieuDetection: demande.id_lieuDetection,
      sequence: sequence,
      subDemandes: cleanSubDemandes,
    };

    console.log(subDemandes);
    console.log(demandeToSubmit);

    if (token) {
      console.log(token);
      const resDemande = await create_demande_api(demandeToSubmit, token);

      console.log(resDemande);
      if (resDemande.resData) {
        if (resDemande.resData.data.statusDemande) {
          openNotification(api, resDemande.resData.message);
        } else {
          openNotificationSuccess(api, resDemande.resData.message);
        }
      } else {
        openNotification(api, resDemande.resError.message);
      }
      setSequence("");
      setSequenceValid(false);
      setSubDemandes([]);
    }
  };

  return (
    <div className="dashboard">
      {contextHolder}
      <div style={{ paddingBottom: "13px" }}>
        <Breadcrumb style={{ fontSize: FONTSIZE.PRIMARY }} items={breadcrumb} />
      </div>
      <Form layout="vertical" onFinish={onSubmit}>
        {/* <CardComponent padding={"10px"} margin={"0 0 10px 0"}> */}
        <CardComponent padding={"7px"}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Sequence"
                validateStatus={!sequenceValid && sequence ? "error" : ""}
                help={
                  !sequenceValid && sequence
                    ? "Invalid sequence or not in CMS"
                    : ""
                }
              >
                <Input
                  style={{ height: "34px" }}
                  value={sequence}
                  onChange={(e) => handleSequenceChange(e.target.value)}
                  maxLength={12}
                  prefix={<MdOutlineNumbers />}
                  suffix={
                    sequenceValid && (
                      <IoIosCheckmarkCircle style={{ color: "green" }} />
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Site" required>
                <Select
                  style={{ height: "34px" }}
                  value={demande.id_site}
                  placeholder="Select site"
                  onChange={(val) => handleSelectChange("id_site", val)}
                  showSearch
                  optionFilterProp="children"
                >
                  {sites.map((rec) => (
                    <Option key={rec.id} value={rec.id}>
                      {rec.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Projet" required>
                <Select
                  style={{ height: "34px" }}
                  placeholder="Select projet"
                  value={demande.id_projet}
                  onChange={(val) => handleSelectChange("id_projet", val)}
                  showSearch
                  optionFilterProp="children"
                >
                  {projects.map((rec) => (
                    <Option key={rec.id} value={rec.id}>
                      {rec.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Lieu detection" required>
                <Select
                  style={{ height: "34px" }}
                  placeholder="Lieu detection"
                  value={demande.id_lieuDetection}
                  onChange={(val) =>
                    handleSelectChange("id_lieuDetection", val)
                  }
                  showSearch
                  optionFilterProp="children"
                >
                  {lieuDetection.map((rec) => (
                    <Option key={rec.id} value={rec.id}>
                      {rec.nom}
                    </Option>
                  ))}
                </Select>
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
                emptyText: <Empty description="Aucune donnée trouvée" />,
              }}
            />
          </CardComponent>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "17px",
            paddingBottom: "17px",
          }}
        >
          <div style={{ paddingRight: "10px" }}>
            <Form.Item>
              <CardComponent>
                <SharedButton
                  padding={"17px 11px"}
                  colorText={COLORS.BLACK}
                  callBack={handleAddRow}
                  name={"Ajout sub demande"}
                  // icon={<MdOutlineLibraryAdd />}
                />
              </CardComponent>
            </Form.Item>
          </div>
          <Form.Item>
            <CardComponent>
              <SharedButton
                icon={<MdOutlineLibraryAdd size={ICONSIZE.SMALL} />}
                padding={"17px 11px"}
                type="primary"
                // color={COLORS.LearRed}
                name={"Enregistrer"}
                color={COLORS.LearRed}
                disabled={!sequenceValid || subDemandes.length === 0}
              />
            </CardComponent>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CreeDemande;
