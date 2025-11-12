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
      { header: "Projet", dataIndex: "projetNom" },
      { header: "Part Number", dataIndex: "partNumber" },
      { header: "Pattern", dataIndex: "patternNumb" },
      { header: "Matière", dataIndex: "partNumberMaterial" },
      { header: "Bin de stockage", dataIndex: "bin_code" },
      { header: "Qte en stock", dataIndex: "quantite" },
    ];

    if (!data || data.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    const headerKeys = exportSchema.map((col) => col.dataIndex);
    const customHeaders = exportSchema.map((col) => col.header);

    const filteredData = data.map((row) => {
      const filteredRow = {};
      headerKeys.forEach((key) => {
        filteredRow[key] = row[key] ?? "";
      });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      header: headerKeys,
    });

    XLSX.utils.sheet_add_aoa(worksheet, [customHeaders], { origin: "A1" });

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    range.e.r = filteredData.length;
    worksheet["!ref"] = XLSX.utils.encode_range(range);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "stockDATA");

    const today = new Date().toISOString().split("T")[0];
    const fileName = `qte_stock_hopital_${today}.xlsx`;

    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );

    saveAs(dataBlob, fileName);
  };

  return (
    <div>
      {contextHolder}
      <Button type="primary" onClick={() => exportToExcel(stockDATA)}>
        Excel Export <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
      </Button>
    </div>
  );
};
