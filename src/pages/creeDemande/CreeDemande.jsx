import { useState, useEffect } from "react";
import {
  Input,
  Select,
  Form,
  Table,
  notification,
  Empty,
  InputNumber,
  Col,
  Row,
  Button,
  Modal,
  Card,
} from "antd";
import CardComponent from "../../components/card/cardComponent";
import {
  openNotification,
  openNotificationSuccess,
} from "../../components/notificationComponent/openNotification";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import SharedButton from "../../components/button/button";
import { get_sites } from "../../api/get_sites";
import { get_lieuDetection } from "../../api/get_lieuDetection";
import { create_demande_api } from "../../api/create_demande_api";
import { confirm_demande_api } from "../../api/confirm_demande_api";
import { useDispatch, useSelector } from "react-redux";
import { set_loading } from "../../redux/slices";

const { Option } = Select;

const CreeDemande = () => {
  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [lieuDetection, setLieuDetection] = useState([]);
  const [sequence, setSequence] = useState("");
  const [subDemandes, setSubDemandes] = useState([]);
  const [subDemandesModal, setSubDemandesModal] = useState([]);
  const [subDemandesModalComfirm, setSubDemandesModalComfirm] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [demande, setDemande] = useState({});
  const dispatch = useDispatch();
  const fullname = useSelector((state) => state.app.fullname);
  const token = useSelector((state) => state.app.tokenValue);
  const id_userMUS = useSelector((state) => state.app.userId);
  const isLoading = useSelector((state) => state.app.isLoading);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  const [messageDetails, setMessageDetails] = useState("");
  const [demandeStatus, setDemandeStatus] = useState("");
  const [modalStyle, setModalStyle] = useState({});
  const [open, setOpen] = useState(false);
  const [projetNom, setProjet] = useState("");
  const fetchData = async () => {
    try {
      const res = await fetch("/cms.json");
      const json = await res.json();
      setData(json);

      const resSites = await get_sites();
      setSites(resSites?.resData?.data);

      const resLieu = await get_lieuDetection();
      setLieuDetection(resLieu?.resData?.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validation et changement de sequence
  const handleSequenceChange = (val) => {
    if (/^\d{12}$/.test(val)) {
      const cmsObj = data?.CMS?.find((c) => c?.sequence === val);
      if (cmsObj) {
        setSequence(val);
        setProjet(cmsObj.projetNom);

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
      } else if (val?.length === 12) {
        setSubDemandes([]);
      }
    } else {
      setSubDemandes([]);
    }
  };

  const partNumbers =
    data.CMS?.find((c) => c.sequence === sequence)?.partNumbers || [];
  const materialsMap = data?.Materials?.[0] || null;

  const handleAddRow = () => {
    setSubDemandes((prev) => [
      ...prev,
      {
        key: Date.now() + Math.random(),
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
          const partObj =
            partNumbers?.find(
              (p) => p?.partNumber === updatedRow?.partNumber
            ) || null;
          const partMaterials = partObj?.materials || [];
          const matchedMaterial =
            partMaterials?.find((mat) =>
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
      width: 350,
      render: (text, record) => {
        const partObj =
          partNumbers?.find((p) => p?.partNumber === record?.partNumber) ||
          null;
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
      title: "Défaut",
      dataIndex: "defaut",
      key: "defaut",
      width: 400,
      render: (text, record) => (
        <Select
          mode="tags"
          placeholder="Sélectionnez ou Saisir un défaut"
          style={{ width: "100%" }}
          value={
            record.code_defaut
              ? [record.code_defaut]
              : record.typeDefaut
              ? [record.typeDefaut]
              : []
          }
          open={!!open[record.key]}
          onDropdownVisibleChange={(isOpen) => {
            setOpen((prev) => ({ ...prev, [record.key]: isOpen }));
          }}
          onChange={(values) => {
            const val = values[values.length - 1];

            const cmsMatch = data.DefautCMS.find(
              (d) => `${d.code_defaut} ${d.typeDefaut}` === val
            );

            if (cmsMatch) {
              handleChange(record.key, "defaut", {
                code_defaut: cmsMatch.code_defaut,
                typeDefaut: cmsMatch.typeDefaut,
              });
            } else {
              handleChange(record.key, "defaut", {
                code_defaut: "",
                typeDefaut: val,
              });
            }
            setOpen((prev) => ({ ...prev, [record.key]: false }));
          }}
        >
          {data.DefautCMS.map((def) => (
            <Select.Option
              key={`${def.code_defaut} ${def.typeDefaut}`}
              value={`${def.code_defaut} ${def.typeDefaut}`}
            >
              {def.code_defaut === ""
                ? `${def.code_defaut} (${def.typeDefaut})`
                : def.typeDefaut}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      width: 250,
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text, record) => (
        <InputNumber
          min={1}
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
      if (!row.code_defaut && !row.typeDefaut)
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

      await form.validateFields();

      const cleanSubDemandes = subDemandes.map(({ key, ...rest }) => rest);
      console.log(cleanSubDemandes);
      const demandeToSubmit = {
        demandeData: {
          id_userMUS,
          demandeur: fullname,
          id_site: demande.id_site,
          id_lieuDetection: demande.id_lieuDetection,
          projetNom,
        },
        sequence,
        subDemandes: cleanSubDemandes,
      };

      dispatch(set_loading(true));
      const resDemande = await create_demande_api(demandeToSubmit, token);
      if (resDemande.resData) {
        if (resDemande.resData?.data?.demande?.statusDemande === "Hors stock") {
          setMessageDetails(resDemande?.resData?.message || "");
          setDemandeStatus(resDemande.resData?.data?.demande?.statusDemande);
          setModalStyle({
            bg: COLORS.RED_ALERT,
            tableColunmColor: COLORS.RED_ALERT_TABLE_COLUMN,
          });
          form.resetFields();
          setSubDemandes([]);
          setProjet("");
          setSequence("");
          setSubDemandesModal(resDemande?.resData?.data?.subDemandes || []);
          setModalDetails(true);
        } else {
          setSubDemandesModalComfirm(resDemande?.resData?.data || []);
          setMessageDetails("");
          setModalVisible(true);
        }
      }
    } catch (err) {
      console.log("Erreur lors de la validation des champs");
    }
    dispatch(set_loading(false));
  };

  const handleConfirm = async (decision) => {
    try {
      dispatch(set_loading(true));
      const res = await confirm_demande_api(
        {
          decision,
          demandeData: {
            id_userMUS,
            demandeur: fullname,
            id_site: demande.id_site,
            id_lieuDetection: demande.id_lieuDetection,
            sequence,
            projetNom,
          },
          subDemandes: subDemandesModalComfirm,
        },
        token
      );
      dispatch(set_loading(false));
      setModalVisible(false);
      if (decision === "accept") {
        if (res.resData) {
          setMessageDetails(res.resData.message);
          setModalDetails(true);
          console.log(
            "================res.resData.data.demandeDetailsAfterAcceptation===================="
          );
          console.log(res.resData.data.demandeDetailsAfterAcceptation);
          console.log("====================================");
          setSubDemandesModalComfirm(
            res.resData.data.demandeDetailsAfterAcceptation
          );
          if (res.resData.data.hasStockLimite) {
            setDemandeStatus("LIMITE");
            // setModalStyle({
            //   bg: COLORS.WARNIGN_ALERT,
            //   tableColunmColor: COLORS.WARNIGN_ALERT_TABLE_COLUMN,
            // });
          } else {
            setDemandeStatus("ENSTOCK");
            // setModalStyle({
            //   bg: COLORS.GREEN_ALERT,
            //   tableColunmColor: COLORS.GREEN_ALERT_TABLE_COLUMN,
            // });
          }
        } else {
          console.log(res.resError);
        }
      }

      setSequence("");
      form.resetFields();
      setSubDemandes([]);
      setProjet("");
    } catch (err) {
      dispatch(set_loading(false));
    }
  };

  return (
    <div className="dashboard">
      {contextHolder}
      <div style={{ paddingBottom: "10px " }}>
        <h4 style={{ margin: "0px" }}>Nouvelle demande</h4>
      </div>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <CardComponent padding={"7px"}>
          <Row gutter={24} align="middle">
            <Col xs={24} sm={12} md={6}>
              {" "}
              <Form.Item
                label="Seq:"
                name="sequence"
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
                      data?.CMS?.some((c) => c?.sequence === value)
                        ? Promise.resolve()
                        : Promise.reject(
                            "La sequence n'existe pas dans le CMS"
                          ),
                  },
                ]}
              >
                <Input
                  style={{ width: 120, height: 34 }}
                  value={sequence}
                  onChange={(e) => handleSequenceChange(e.target.value)}
                  maxLength={12}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              {" "}
              <Form.Item label="Projet:">
                <Input
                  style={{ width: 150, height: 34 }}
                  value={projetNom}
                  readOnly
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              {" "}
              <Form.Item
                label="Site:"
                name="id_site"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un site !",
                  },
                ]}
              >
                <Select
                  style={{ width: 150, height: 34 }}
                  placeholder="Sélectionnez un site"
                  value={demande.id_site}
                  onChange={(val) => handleSelectChange("id_site", val)}
                  showSearch
                  optionFilterProp="children"
                >
                  {sites?.map((rec) => (
                    <Option key={rec.id} value={rec.id}>
                      {rec.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              {" "}
              <Form.Item
                label="Lieu:"
                name="id_lieuDetection"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un lieu de détection !",
                  },
                ]}
              >
                <Select
                  style={{ width: 150, height: 34 }}
                  placeholder="Sélectionnez un lieu"
                  value={demande.id_lieuDetection}
                  onChange={(val) =>
                    handleSelectChange("id_lieuDetection", val)
                  }
                  showSearch
                  optionFilterProp="children"
                >
                  {lieuDetection?.map((rec) => (
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
            paddingTop: "17px",
            display: "flex",
            justifyContent: "start",
          }}
        ></div>

        <div>
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
                  description="Ajouter sub demande"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "17px",
            // paddingBottom: "17px",
          }}
        >
          <div style={{ paddingRight: "7px" }}>
            <Button onClick={handleAddRow} color="danger" variant="outlined">
              Ajouter une sub-demande
            </Button>
          </div>
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
      <Modal
        title="Comfirmation de la demande"
        open={modalVisible}
        // closable={false}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="refuse" danger onClick={() => handleConfirm("refuse")}>
            Refuser
          </Button>,
          <Button
            key="accept"
            type="primary"
            onClick={() => handleConfirm("accept")}
          >
            Accepter
          </Button>,
        ]}
      >
        <>
          <p
            style={{
              paddingBottom: "17px",
            }}
          >
            Veuillez vérifier les pièces demandées ci-dessous :
          </p>

          <Table
            rowClassName={() => "ant-row-no-hover"}
            size="small"
            bordered
            dataSource={subDemandesModalComfirm}
            rowKey="key"
            pagination={false}
            columns={[
              { title: "Part Number", dataIndex: "partNumber" },
              { title: "Pattern", dataIndex: "patternNumb" },
              { title: "Matière", dataIndex: "materialPartNumber" },
              { title: "Qte demandé", dataIndex: "quantite" },
              { title: "Qte disponible", dataIndex: "quantiteDisponible" },
              {
                title: "Status",
                dataIndex: "statusSubDemande",
              },
            ]}
          />
        </>
      </Modal>
      {/* <Modal
        title="Détails de la demande"
        open={modalDetails}
        // closable={false}
        style={{
          backgroundColor
        }}
        onCancel={() => setModalDetails(false)}
        width={800}
        footer={[]}
      >
        <>
          <p
            style={{
              paddingBottom: "17px",
            }}
          >
            {messageDetails}
          </p>

          <Table
            dataSource={
              demandeStatus === "Hors stock"
                ? subDemandesModal
                : subDemandesModalComfirm
            }
            rowKey="key"
            pagination={false}
            columns={[
              { title: "Part Number", dataIndex: "partNumber" },
              { title: "Pattern", dataIndex: "patternNumb" },
              { title: "Matière", dataIndex: "materialPartNumber" },
              { title: "Qte demandé", dataIndex: "quantite" },
              { title: "Qte disponible", dataIndex: "quantiteDisponible" },
              {
                title: "Status",
                dataIndex: "statusSubDemande",
              },
            ]}
          />
        </>
      </Modal> */}

      <Modal
        title="Détails de la demande"
        open={modalDetails}
        onCancel={() => setModalDetails(false)}
        width={800}
        footer={[]}
      >
        <>
          {/* <style>{`
          .ant-modal-title{
          background-color:${modalStyle.bg};
          }
          .ant-modal-content{

              background-color:${modalStyle.bg} !important;
              
            }
          `}</style> */}

          <p style={{ paddingBottom: "17px" }}>{messageDetails}</p>
          <Table
            style={{
              background: "#000",
              borderRadius: "0",
            }}
            rowClassName={() => "ant-row-no-hover"}
            bordered
            size="small"
            dataSource={
              demandeStatus === "Hors stock"
                ? subDemandesModal
                : subDemandesModalComfirm
            }
            rowKey="key"
            pagination={false}
            columns={[
              {
                title: "Part Number",
                dataIndex: "partNumber",
              },
              {
                title: "Pattern",
                dataIndex: "patternNumb",
              },
              {
                title: "Matière",
                dataIndex: "materialPartNumber",
              },
              {
                title: "Qte demandé",
                dataIndex: "quantite",
              },
              {
                title: "Qte disponible",
                dataIndex: "quantiteDisponible",
              },
              {
                title: "Status",
                dataIndex: "statusSubDemande",
              },
            ]}
          />
        </>
      </Modal>
    </div>
  );
};

export default CreeDemande;
