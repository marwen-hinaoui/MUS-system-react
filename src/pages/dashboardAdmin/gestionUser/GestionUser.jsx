import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Table,
  Empty,
  notification,
  InputNumber,
  Checkbox,
  Row,
  Col,
} from "antd";
import { COLORS } from "../../../constant/colors";
import { gestion_user_api } from "../../../api/gestion_user_api";
import { get_all_users_api } from "../../../api/get_all_users_api";
import { get_fonctions_api } from "../../../api/get_fonctions_api";
import { update_password_api } from "../../../api/update_password_api";
import { useSelector } from "react-redux";
import { FONTSIZE, ICONSIZE } from "../../../constant/FontSizes";
import { openNotificationSuccess } from "../../../components/notificationComponent/openNotification";
import { MdDelete, MdOutlinePassword } from "react-icons/md";
import { delete_user_api } from "../../../api/delete_user_api";
import { RiEdit2Fill } from "react-icons/ri";
import { get_projet_api } from "../../../api/get_projet_api";

const { Option } = Select;

const GestionUser = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [passwordForm] = Form.useForm();
  const [fonctionList, setFonctionList] = useState([]);
  const [projets, setProjets] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [selectedUserDelete, setSelectedUserDelete] = useState({});
  const token = useSelector((state) => state.app.tokenValue);
  useEffect(() => {
    getAllUsers();
    getFonctions();
    getProjets();
  }, []);

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordModalVisible(true);
    passwordForm.resetFields();
  };
  const openModal = () => {
    setVisible(true);
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nom",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Prénom",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Matricule",
      dataIndex: "matricule",
      key: "matricule",
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Projet",
      dataIndex: "projetList",
      key: "projetList",
      render: (projetList) => {
        if (!projetList) return null;
        return projetList.map((role) => role).join(", ");
      },
    },
    {
      title: "Fonction",
      dataIndex: "fonctioNom",
      key: "fonctioNom",
    },
    {
      title: "Rôle",
      dataIndex: "roleList",
      key: "roleList",
      render: (roleList) => {
        if (!roleList) return null;

        const roleLabels = {
          GESTIONNAIRE_STOCK: "Gestionnaire stock",
          DEMANDEUR: "Demandeur",
          AGENT_MUS: "Agent stock",
          Admin: "Admin",
        };

        return roleList.map((role) => roleLabels[role] || role).join(", ");
      },
    },
    {
      title: "Site",
      dataIndex: "siteNom",
      key: "siteNom",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,

      render: (_, record) => (
        <div
          style={{
            display: "flex",
          }}
        >
          <RiEdit2Fill
            color={COLORS.Blue}
            onClick={() => {
              openPasswordModal(record);
            }}
            style={{ cursor: "pointer", marginRight: "5px" }}
            size={ICONSIZE.SMALL}
          />
          <MdDelete
            color={COLORS.LearRed}
            onClick={() => showModalDelete(record)}
            style={{ cursor: "pointer" }}
            size={ICONSIZE.SMALL}
          />
        </div>
      ),
    },
  ];
  const fonctionRoleMapping = {
    1: ["Admin"],
    2: ["DEMANDEUR"],
    3: ["AGENT_MUS"],
    4: ["GESTIONNAIRE_STOCK"],
    5: ["DEMANDEUR"],
  };
  const showModalDelete = (user) => {
    setSelectedUserDelete(user);
    setModalDeleteVisible(true);
  };

  const closeModalDelete = () => {
    setSelectedUserDelete(null);
    setModalDeleteVisible(false);
  };
  const handleFonctionChange = (fonctionId) => {
    if (fonctionRoleMapping[fonctionId]) {
      setSelectedRoles(fonctionRoleMapping[fonctionId]);
      form.setFieldsValue({ roles: fonctionRoleMapping[fonctionId] });
    } else {
      setSelectedRoles([]);
      form.setFieldsValue({ roles: [] });
    }
  };
  const handleChange = (checkedValues) => {
    if (checkedValues.includes("Admin")) {
      setSelectedRoles(["Admin"]);
    } else {
      setSelectedRoles(checkedValues);
    }
  };
  const isAdminSelected = selectedRoles.includes("Admin");
  const handlePasswordUpdate = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);

      const res = await update_password_api(
        selectedUser.id,
        values.newPassword,
        token
      );

      if (res.resData) {
        openNotificationSuccess(api, res.resData.message);
        setPasswordModalVisible(false);
      }
    } catch (error) {
      console.log("Erreur mise à jour mot de passe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const res = await delete_user_api(selectedUserDelete.id, token);
      if (res.resData) {
        openNotificationSuccess(api, res.resData.message);
        getAllUsers();
      }
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);
    } finally {
      setLoading(false);
      closeModalDelete();
    }
  };
  const closeModal = () => {
    setVisible(false);
    setSelectedRoles([]);
    form.resetFields();
  };

  const getAllUsers = async () => {
    try {
      const res = await get_all_users_api(token);
      console.log(res.resData);

      setUsers(res?.resData?.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const getFonctions = async () => {
    try {
      const getFonctions = await get_fonctions_api(token);
      if (getFonctions.resData) {
        console.log(getFonctions.resData);
        setFonctionList(getFonctions.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProjets = async () => {
    try {
      const res = await get_projet_api();
      if (res.resData) {
        console.log(res.resData);
        setProjets(res.resData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      console.log("---- values -----");

      console.log(values);

      const resUser = await gestion_user_api(values, token);
      if (resUser.resData) {
        closeModal();
        openNotificationSuccess(api, "Utilisateur crée");
        form.resetFields();
        getAllUsers();
      } else {
        console.log(resUser.resError);
      }
    } catch (error) {
      console.log("Error creation user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {contextHolder}
      <Modal
        title="Confirmer la suppression"
        visible={modalDeleteVisible}
        onCancel={closeModalDelete}
        footer={[
          <Button key="cancel" onClick={closeModalDelete}>
            Annuler
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
            Supprimer
          </Button>,
        ]}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer{" "}
          <strong>
            {selectedUserDelete?.firstName} {selectedUserDelete?.lastName}
          </strong>{" "}
          ?
        </p>
      </Modal>
      <Modal
        title={`Modifier mot de passe pour ${selectedUser?.username}`}
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handlePasswordUpdate}
          >
            Mettre à jour
          </Button>,
        ]}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            required={false}
            label="Nouveau mot de passe"
            rules={[{ required: true, message: "Entrez un mot de passe" }]}
          >
            <Input.Password
              iconRender={() => (
                <MdOutlinePassword style={{ fontSize: FONTSIZE.PRIMARY }} />
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ajouter nouveau utilisateur"
        visible={visible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Enregistrer
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            required={false}
            name="firstName"
            label="Nom: "
            rules={[{ required: true, message: "Saisie Nom!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            required={false}
            name="lastName"
            label="Prénom: "
            rules={[{ required: true, message: "Saisie prénom" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            required={false}
            name="email"
            label="Email: "
            rules={[
              { required: true, message: "Saisie email!" },
              { type: "email", message: "Email format Invalide!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            required={false}
            name="matricule"
            label="Matricule: "
            rules={[{ required: true, message: "Saisie matricule!" }]}
          >
            <InputNumber maxLength={7} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            required={false}
            name="username"
            label="Username: "
            rules={[{ required: true, message: "Saisie username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            required={false}
            name="password"
            label="Password: "
            rules={[{ required: true, message: "Saisie password!" }]}
          >
            <Input.Password
              iconRender={() => (
                <MdOutlinePassword style={{ fontSize: FONTSIZE.PRIMARY }} />
              )}
            />
          </Form.Item>
          <Form.Item
            name="id_fonction"
            label="Fonction: "
            required={false}
            rules={[{ required: true, message: "Sélectionnez Fonction!" }]}
          >
            <Select
              showSearch
              onChange={handleFonctionChange}
              placeholder="Select Fonction"
            >
              {fonctionList.map((f) => {
                return <Option value={f.id}>{f.nom}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="roles"
            label="Rôle: "
            rules={[{ required: true, message: "Saisie role!" }]}
            required={false}
          >
            <Select
              mode="multiple"
              value={selectedRoles}
              onChange={handleChange}
              placeholder="Select roles"
              style={{ flex: 1 }}
              options={[
                { value: "Admin", label: "Admin" },

                ...(!isAdminSelected
                  ? [
                      { value: "DEMANDEUR", label: "Demandeur" },
                      { value: "AGENT_MUS", label: "Agent Stock" },
                      {
                        value: "GESTIONNAIRE_STOCK",
                        label: "Gestionnaire Stock",
                      },
                    ]
                  : []),
              ]}
            />
          </Form.Item>

          <Form.Item
            name="id_projet"
            label="Projet: "
            required={false}
            rules={[{ required: true, message: "Sélectionnez projet!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select projets"
              style={{ flex: 1 }}
              options={projets.map((f) => ({
                value: f.id,
                label: f.nom,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="id_site"
            label="Site: "
            required={false}
            rules={[{ required: true, message: "Sélectionnez site!" }]}
          >
            <Select placeholder="Select site">
              <Option value={1}>GreenField</Option>
              <Option value={2}>BrownField</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ paddingBottom: "16px" }}>
        <h4 style={{ margin: "0px" }}>Gestion des comptes</h4>
      </div>

      <Button onClick={openModal} color="danger" variant="outlined">
        Ajouter Utilisateur
      </Button>
      <div style={{ padding: "13px 0" }}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "25", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
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
        />
      </div>
    </div>
  );
};

export default GestionUser;
