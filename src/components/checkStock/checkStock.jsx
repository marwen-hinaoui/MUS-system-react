import { Button, Empty, InputNumber, Modal, notification, Table } from "antd";
import React, { useState } from "react";

import { ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { useSelector } from "react-redux";
import { openNotificationSuccess } from "../notificationComponent/openNotification";
import { RiEdit2Fill } from "react-icons/ri";
import { update_stock_api } from "../../api/update_stock_api";
import { ExcelReader } from "../excelReader/excelReader";
export const CheckStock = React.memo(({ stockDATA, refreshData }) => {
  const roleList = useSelector((state) => state.app.roleList);
  const token = useSelector((state) => state.app.tokenValue);
  const [idStock, setIdStock] = useState({});
  const [qteAjour, setQteAjour] = useState({});
  const [editingModal, setEditingModal] = useState(false);
  const [laodingComfirmation, setLaodingComfirmation] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const updateQteStock = async () => {
    setLaodingComfirmation(true);

    try {
      const resUpdate = await update_stock_api(idStock, qteAjour, token);
      if (resUpdate.resData) {
        console.log(resUpdate.resData);

        openNotificationSuccess(api, resUpdate.resData.message);
        setEditingModal(false);
        refreshData();
      }
    } catch (error) {
    } finally {
      setLaodingComfirmation(false);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", width: 60 },

    {
      title: "Projet",
      dataIndex: "projetNom",
      filters: [...new Set(stockDATA?.map((d) => d.projetNom))].map(
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
      filters: [...new Set(stockDATA?.map((d) => d.partNumber))].map((pn) => ({
        text: pn,
        value: pn,
      })),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    {
      title: "Pattern",
      dataIndex: "patternNumb",
      filters: [...new Set(stockDATA?.map((d) => d.patternNumb))].map(
        (pattern) => ({
          text: pattern,
          value: pattern,
        })
      ),
      onFilter: (value, record) => record.patternNumb === value,
      filterSearch: true,
    },
    { title: "Matière", dataIndex: "partNumberMaterial" },
    { title: "Qte en stock", dataIndex: "quantite", width: 150 },
  ];

  if (roleList.includes("Admin") || roleList.includes("GESTIONNAIRE_STOCK")) {
    columns.push({
      width: 70,
      title: "Action",
      key: "action",
      render: (text, record) => (
        <RiEdit2Fill
          color={COLORS.Blue}
          onClick={() => {
            setIdStock(record.id);
            setQteAjour(record.quantite);
            setEditingModal(true);
          }}
          style={{ cursor: "pointer" }}
          size={ICONSIZE.SMALL}
        />
      ),
    });
  }

  return (
    <div>
      {contextHolder}

      <Table
        style={{
          padding: "13px 0 0 0",
        }}
        bordered
        dataSource={stockDATA}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          defaultPageSize: "10",
          pageSizeOptions: ["5", "10", "25", "50", "100"],
        }}
        locale={{
          emptyText: <p>Aucune donnée trouvée</p>,
        }}
        size="small"
      />

      <Modal
        title={<p style={{ margin: 0 }}>Modifier qte stock</p>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={editingModal}
        onCancel={() => {
          setEditingModal(false);
        }}
        footer={[
          <Button danger onClick={() => setEditingModal(false)}>
            Annuler
          </Button>,
          <Button
            type="primary"
            onClick={() => updateQteStock()}
            loading={laodingComfirmation}
          >
            Confirmer
          </Button>,
        ]}
      >
        <p
          style={{
            marginBottom: "8px",
            marginTop: "-8px",
          }}
        >
          Veuillez indiquer la quantité que vous souhaitez intégrer en stock:
        </p>
        <InputNumber
          onChange={(value) => {
            setQteAjour(value);
            console.log(value);
          }}
          min={0}
          max={10000}
          value={qteAjour}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
});
