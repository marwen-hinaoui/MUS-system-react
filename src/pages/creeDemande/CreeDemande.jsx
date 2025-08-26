import { useState, useEffect } from "react";
import {
  Input,
  Select,
  Form,
  Table,
  notification,
  Breadcrumb,
  Empty,
  InputNumber,
  Col,
  Row,
  Button,
} from "antd";
import CardComponent from "../../components/card/cardComponent";
import { openNotification } from "../../components/notificationComponent/openNotification";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import SharedButton from "../../components/button/button";
import { get_project } from "../../api/get_project";
import { get_sites } from "../../api/get_sites";
import { get_lieuDetection } from "../../api/get_lieuDetection";
import { create_demande_api } from "../../api/create_demande_api";
import { useDispatch, useSelector } from "react-redux";
import { set_loading } from "../../redux/slices";
import LoadingComponent from "../../components/loadingComponent/loadingComponent";

const { Option } = Select;

const breadcrumb = [
  { title: <RiDashboardHorizontalLine /> },
  { title: <Link to={"/admin"}>Dashboard</Link> },
  { title: "Création de demande" },
];

const CreeDemande = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [lieuDetection, setLieuDetection] = useState([]);
  const [sequence, setSequence] = useState("");
  const [subDemandes, setSubDemandes] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [demande, setDemande] = useState({});
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.tokenValue);
  const id_userMUS = useSelector((state) => state.app.userId);
  const isLoading = useSelector((state) => state.app.isLoading);
  const [form] = Form.useForm();

  // Récupération des données
  const fetchData = async () => {
    try {
      const res = await fetch("/cms.json");
      const json = await res.json();
      setData(json);

      const resProjet = await get_project();
      setProjects(resProjet.resData.data);

      const resSites = await get_sites();
      setSites(resSites.resData.data);

      const resLieu = await get_lieuDetection();
      setLieuDetection(resLieu.resData.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (
    data.length === 0 ||
    projects.length === 0 ||
    sites.length === 0 ||
    lieuDetection.length === 0
  )
    return <LoadingComponent header={true} />;

  // Validation et changement de sequence
  const handleSequenceChange = (val) => {
    setSequence(val);
    if (/^\d{12}$/.test(val)) {
      const exists = data?.CMS.some((c) => c.sequence === val);
      if (exists) {
        setSubDemandes([
          {
            key: Date.now(),
            partNumber: "",
            patternNumb: "",
            materialPartNumber: "",
            code_defaut: "",
            quantite: "",
          },
        ]);
      } else if (val.length === 12) {
        setSubDemandes([]);
      }
    } else {
      setSubDemandes([]);
    }
  };

  const partNumbers =
    data.CMS.find((c) => c.sequence === sequence)?.partNumbers || [];
  const materialsMap = data?.Materials[0];

  const handleAddRow = () => {
    setSubDemandes((prev) => [
      ...prev,
      {
        key: Date.now(),
        partNumber: "",
        patternNumb: "",
        materialPartNumber: "",
        code_defaut: "",
        quantite: "",
      },
    ]);
  };

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
        if (field === "patternNumb") {
          const partObj = partNumbers.find(
            (p) => p.partNumber === updatedRow.partNumber
          );
          const partMaterials = partObj?.materials || [];
          const matchedMaterial =
            partMaterials.find((mat) =>
              materialsMap[mat]?.includes(Number(value))
            ) || "";
          updatedRow.materialPartNumber = matchedMaterial;
        }
        return updatedRow;
      })
    );
  };

  const handleDelete = (key) => {
    setSubDemandes((prev) => prev.filter((row) => row.key !== key));
  };

  const columns = [
    {
      title: "Part number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text, record) => (
        <Select
          value={record.partNumber || undefined}
          placeholder="Sélectionnez le Part number"
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
      dataIndex: "patternNumb",
      key: "patternNumb",
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
            value={record.patternNumb || undefined}
            placeholder="Sélectionnez le Pattern"
            onChange={(val) => handleChange(record.key, "patternNumb", val)}
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
      title: "Défaut",
      dataIndex: "defaut",
      key: "defaut",
      render: (text, record) => (
        <Select
          value={record.code_defaut || undefined}
          placeholder="Sélectionnez un défaut"
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
      render: (_, record) => {
        const onlyOneRow = subDemandes.length === 1;
        return (
          <MdDelete
            style={{ cursor: "pointer" }}
            color={COLORS.LearRed}
            size={ICONSIZE.SMALL}
            onClick={() => handleDelete(record.key)}
            disabled={onlyOneRow}
          />
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

  // Validation des sub-demandes
  const validateSubDemandes = () => {
    for (let i = 0; i < subDemandes.length; i++) {
      const row = subDemandes[i];
      if (!row.partNumber)
        return `Sub demande ${i + 1} : le Part number est obligatoire`;
      if (!row.patternNumb)
        return `Sub demande ${i + 1} : le Pattern est obligatoire`;
      if (!row.materialPartNumber)
        return `Sub demande ${i + 1} : le Material est obligatoire`;
      if (!row.code_defaut)
        return `Sub demande ${i + 1} : le Défaut est obligatoire`;
      if (!row.quantite)
        return `Sub demande ${i + 1} : la Quantité est obligatoire`;
    }
    return null;
  };

  const onSubmit = async () => {
    try {
      const subError = validateSubDemandes();
      if (subError) {
        openNotification(api, subError);
        return;
      }

      const values = await form.validateFields();

      const cleanSubDemandes = subDemandes.map(({ key, ...rest }) => rest);
      const demandeToSubmit = {
        id_userMUS,
        id_site: demande.id_site,
        id_projet: demande.id_projet,
        id_lieuDetection: demande.id_lieuDetection,
        sequence,
        subDemandes: cleanSubDemandes,
      };

      if (token) {
        dispatch(set_loading(true));
        const resDemande = await create_demande_api(demandeToSubmit, token);
        dispatch(set_loading(false));
        if (resDemande.resData) {
          openNotification(
            api,
            resDemande.resData.message || "Demande créée avec succès !"
          );
          setSequence("");
          setSubDemandes([]);
          form.resetFields();
        } else {
          openNotification(
            api,
            resDemande.resError.message ||
              "Erreur lors de la création de la demande"
          );
        }
      }
    } catch (err) {
      console.log("Erreur de validation :", err);
    }
  };

  return (
    <div className="dashboard">
      {contextHolder}
      <div style={{ paddingBottom: "13px" }}>
<<<<<<< HEAD
        <Breadcrumb
          style={{ fontSize: FONTSIZE.XPRIMARY }}
          items={breadcrumb}
        />
=======
         <h4>Création de demande</h4>
>>>>>>> c31ebc7 (aa)
      </div>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <CardComponent padding={"7px"}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Sequence"
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
                  {
                    validator: (_, value) =>
                      data?.CMS.some((c) => c.sequence === value)
                        ? Promise.resolve()
                        : Promise.reject(
                            "La sequence n'existe pas dans le CMS"
                          ),
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
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Site"
                name="id_site"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un site !",
                  },
                ]}
              >
                <Select
                  style={{ height: "34px" }}
                  placeholder="Sélectionnez un site"
                  value={demande.id_site}
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
              <Form.Item
                label="Projet"
                name="id_projet"
                required={false}
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un projet !",
                  },
                ]}
              >
                <Select
                  style={{ height: "34px" }}
                  placeholder="Sélectionnez un projet"
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
              <Form.Item
                label="Lieu de détection"
                required={false}
                name="id_lieuDetection"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un lieu de détection !",
                  },
                ]}
              >
                <Select
                  style={{ height: "34px" }}
                  placeholder="Sélectionnez un lieu de détection"
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

        <div
          style={{
            padding: "17px 0",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Button onClick={handleAddRow} color="danger" variant="outlined">
            Ajouter une sous-demande
          </Button>
        </div>

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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "17px",
            paddingBottom: "17px",
          }}
        >
          <Form.Item>
            <SharedButton
              loading={isLoading}
              type="primary"
              name={"Enregistrer"}
              color={COLORS.LearRed}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CreeDemande;
