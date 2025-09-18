// export const exportToExcel = (data) => {
//   if (!data || data.length === 0) {
//     openNotification(api, "Aucune donnée à exporter !");
//     return;
//   }

//   // Filter by date range
//   let filteredData = data;
//   const [start, end] = exportDateRange;
//   if (exportDateRange && exportDateRange.length === 2) {
//     filteredData = data.filter((item) => {
//       const itemDate = dayjs(item.date_creation, "YYYY-MM-DD");
//       return (
//         itemDate.isSame(start, "day") ||
//         itemDate.isSame(end, "day") ||
//         (itemDate.isAfter(start, "day") && itemDate.isBefore(end, "day"))
//       );
//     });
//   }

//   if (filteredData.length === 0) {
//     openNotification(api, "Aucune donnée trouvée pour cette période !");
//     return;
//   }

//   const worksheet = XLSX.utils.json_to_sheet(filteredData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "MouvementStock");

//   const fileName = `MouvementStock_${start.$D}/${start.$M + 1}/${start.$y} - ${
//     end.$D
//   }/${end.$M + 1}/${end.$y}.xlsx`;

//   const dataBlob = new Blob(
//     [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
//     {
//       type: "application/octet-stream",
//     }
//   );
//   saveAs(dataBlob, fileName);
// };
