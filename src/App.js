import { ConfigProvider, Spin } from "antd";
import AppRoutes from "./routes/routes";
import "@fontsource/inter";

import { COLORS } from "./constant/colors";
import { useEffect, useState } from "react";
// import 'antd/dist/reset.css';
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Notification: {
              colorSuccessBg: "#ffffff",
              colorErrorBg: "#ffffff",
              colorInfoBg: "#ffffff",
              colorWarningBg: "#ffffff",
            },
            Typography: {
              linkDecoration: "underline",
              linkHoverColor: "inherit",
            },
            // Checkbox: {
            //   colorPrimaryBg: COLORS.GREEN,
            // },
            DatePicker: {
              borderRadius: "4px",
            },
            Table: {
              borderRadius: "4px",
              headerBorderRadius: "4px",
              cellBorderRadius: 0,
              headerColor: COLORS.BLACK,
            },
            // Segmented: {
            //   itemSelectedBg: "#EE3124",
            //   itemSelectedColor: "#FFFFFF",
            //   // motionDurationMid: "0s",
            //   itemHoverColor: "none",
            //   itemHoverBg: "none",
            //   colorBgBase: "#000",
            //   // motionEaseOut: "0s",
            // },
          },
          token: {
            fontFamily: "Inter, sans-serif",
            colorPrimary: "#EE3124",
            colorInfo: "#EE3124",
            colorError: "#EE3124",
            colorLink: "#EE3124",
          },
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              alignItems: "center",
            }}
          >
            <Spin size="small" />
          </div>
        ) : (
          <AppRoutes />
        )}
      </ConfigProvider>
    </>
  );
};

export default App;

// import React from "react";
// import { Table, Button, Space } from "antd";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// // Define your raw data
// const rawData = [
//   { key: "1", pattern: "L0000sdsd", material: "x" },
//   { key: "2", pattern: "L000ssssss", material: "x" },
//   { key: "3", pattern: "M1111aaaaa", material: "y" },
//   { key: "4", pattern: "N2222bbbbb", material: "z" },
//   { key: "5", pattern: "N2222ccccc", material: "z" },
// ];

// const processDataForMerging = (data) => {
//   const processedData = [...data].sort((a, b) =>
//     a.material.localeCompare(b.material)
//   );
//   let materialCount = 1;
//   for (let i = processedData.length - 1; i >= 0; i--) {
//     if (i > 0 && processedData[i].material === processedData[i - 1].material) {
//       processedData[i].rowSpan = 0;
//       materialCount++;
//     } else {
//       processedData[i].rowSpan = materialCount;
//       materialCount = 1;
//     }
//   }
//   return processedData;
// };

// const exportToExcel = (data, fileName) => {
//   const exportableData = data.map(({ pattern, material }) => ({
//     pattern,
//     material,
//   }));

//   exportableData.sort((a, b) => a.material.localeCompare(b.material));

//   const ws = XLSX.utils.json_to_sheet(exportableData);

//   let row = 2;
//   const merges = [];
//   const materialCounts = {};
//   exportableData.forEach((item) => {
//     materialCounts[item.material] = (materialCounts[item.material] || 0) + 1;
//   });

//   for (const material in materialCounts) {
//     if (materialCounts[material] > 1) {
//       merges.push({
//         s: { r: row - 1, c: 1 },
//         e: { r: row - 1 + materialCounts[material] - 1, c: 1 },
//       });
//     }
//     row += materialCounts[material];
//   }

//   if (merges.length > 0) {
//     ws["!merges"] = merges;
//   }

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Data");
//   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const file = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(file, `${fileName}.xlsx`);
// };

// const processedData = processDataForMerging(rawData);

// const columns = [
//   {
//     title: "Pattern",
//     dataIndex: "pattern",
//     key: "pattern",
//   },
//   {
//     title: "Material",
//     dataIndex: "material",
//     key: "material",
//     onCell: (record) => ({
//       rowSpan: record.rowSpan,
//     }),
//   },
// ];

// const App = () => (
//   <Space direction="vertical" style={{ width: "100%" }}>
//     <Button
//       type="primary"
//       onClick={() => exportToExcel(rawData, "grouped_data")}
//     >
//       Export Selected Columns to Excel
//     </Button>
//     <Table columns={columns} dataSource={processedData} bordered />
//   </Space>
// );

// export default App;
