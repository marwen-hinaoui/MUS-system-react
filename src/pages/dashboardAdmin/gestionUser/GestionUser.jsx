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
} from "antd";
import { COLORS } from "../../../constant/colors";
import { gestion_user_api } from "../../../api/gestion_user_api";
import { get_all_users_api } from "../../../api/get_all_users_api";
import { useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { ICONSIZE } from "../../../constant/FontSizes";
import { openNotificationSuccess } from "../../../components/notificationComponent/openNotification";
const { Option } = Select;

const GestionUser = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordForm] = Form.useForm();
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordModalVisible(true);
    passwordForm.resetFields();
  };
  const token = useSelector((state) => state.app.tokenValue);
  useEffect(() => {
    getAllUsers();
  }, []);
  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => setVisible(false);

  const getAllUsers = async () => {
    try {
      const res = await get_all_users_api(token);
      setUsers(res?.resData?.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
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
      title: "Rôle",
      dataIndex: "id_roleMUS",
      key: "id_roleMUS",
    },
    {
      title: "Site",
      dataIndex: "id_site",
      key: "id_site",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <>
          <FiEdit
            color={COLORS.Blue}
            onClick={() => {
              openPasswordModal(record);
            }}
            style={{ cursor: "pointer" }}
            size={ICONSIZE.XSMALL}
          />
        </>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

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

      <div style={{ padding: "13px 0px" }}>
        <h4 style={{ margin: "0px" }}>Gestion Utilisateurs</h4>
        {/* <p style={{ margin: "0px", color: COLORS.Gray4 }}>message</p> */}
      </div>
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
            // onClick={}
          >
            Mettre à jour
          </Button>,
        ]}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="Nouveau mot de passe"
            rules={[{ required: true, message: "Entrez un mot de passe" }]}
          >
            <Input.Password />
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
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="id_roleMUS"
            label="Role: "
            rules={[{ required: true, message: "Saisie role!" }]}
            required={false}
          >
            <Select placeholder="Select role">
              <Option value={1}>Admin</Option>
              <Option value={2}>Demandeur</Option>
              <Option value={3}>Agent MUS</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="id_site"
            label="Site: "
            required={false}
            rules={[{ required: true, message: "Saisie site!" }]}
          >
            <Select placeholder="Select site">
              <Option value={1}>BrownField</Option>
              <Option value={2}>GreenField</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Button onClick={openModal} color="danger" variant="outlined">
        Ajouter Utilisateur
      </Button>
      <div style={{ padding: "13px 0" }}>
        <Table
          size="small"
          rowClassName={() => "ant-row-no-hover"}
          className="custom-table"
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
              <Empty
                description="Aucune donnée trouvée"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default GestionUser;
