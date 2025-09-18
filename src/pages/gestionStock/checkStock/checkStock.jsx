import { Button, Empty, InputNumber, Modal, notification, Table } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { MdOutlineFileDownload } from "react-icons/md";
import { ICONSIZE } from "../../../constant/FontSizes";
import { COLORS } from "../../../constant/colors";
import { useSelector } from "react-redux";
import {
  openNotification,
  openNotificationSuccess,
} from "../../../components/notificationComponent/openNotification";
import { RiEdit2Fill } from "react-icons/ri";
import { update_stock_api } from "../../../api/update_stock_api";
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
    { title: "Part Number", dataIndex: "partNumber" },
    { title: "Pattern", dataIndex: "patternNumb" },
    { title: "Matière", dataIndex: "partNumberMaterial" },
    { title: "Qte en stock", dataIndex: "quantite", width: 150 },
  ];

  if (roleList.includes("Admin") || roleList.includes("GESTIONNEUR_STOCK")) {
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

  const exportToExcel = (data) => {
    const exportSchema = [
      { header: "Id", dataIndex: "id" },
      { header: "Projet", dataIndex: "projetNom" },
      { header: "Part Number", dataIndex: "partNumber" },
      { header: "Pattern", dataIndex: "patternNumb" },
      { header: "Matière", dataIndex: "partNumberMaterial" },
      { header: "Qte en stock", dataIndex: "quantite" },
    ];

    if (!data || data.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    const headerKeys = exportSchema.map((col) => col.dataIndex);
    const customHeaders = exportSchema.map((col) => col.header);

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headerKeys,
    });

    XLSX.utils.sheet_add_aoa(worksheet, [customHeaders], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MouvementStock");

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const fileName = `qte_stock_hopital_${todayISO}.xlsx`;

    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );
    saveAs(dataBlob, fileName);
  };
  return (
    <div>
      {contextHolder}
      <div>
        <Button
          type="primary"
          style={{
            float: "right",
          }}
          onClick={() => exportToExcel(stockDATA)}
        >
          Export qte stock <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
        </Button>
      </div>
      <Table
        style={{
          padding: "13px 0 0 0",
        }}
        rowClassName={() => "ant-row-no-hover"}
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
        title="Modifier qte stock"
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
            Comfirmer
          </Button>,
        ]}
      >
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
