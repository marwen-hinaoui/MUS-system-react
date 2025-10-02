import React from "react";
import { ICONSIZE } from "../../../constant/FontSizes";
import { MdOutlineFileDownload } from "react-icons/md";
import { Button, notification } from "antd";
import { openNotification } from "../../../components/notificationComponent/openNotification";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const ExportExcel = ({ stockDATA }) => {
  const [api, contextHolder] = notification.useNotification();

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
      <Button type="primary" onClick={() => exportToExcel(stockDATA)}>
        Export qte stock <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
      </Button>
    </div>
  );
};
