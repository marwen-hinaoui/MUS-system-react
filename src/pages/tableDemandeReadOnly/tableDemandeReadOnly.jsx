// import React, { useEffect, useState } from "react";
// import { Empty, Table, Tooltip } from "antd";
// import { COLORS } from "../../constant/colors";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   set_data_searching,
//   set_demande_data_table,
//   set_drawer,
// } from "../../redux/slices";
// import { ICONSIZE } from "../../constant/FontSizes";
// import DrawerComponent from "../../components/drawer/drawerComponent";
// import { RxCheckCircled } from "react-icons/rx";

// import { IoCloseCircleOutline, IoDocumentText } from "react-icons/io5";
// import { TbHistory } from "react-icons/tb";
// import SearchComponent from "../../components/searchComponent/searchComponent";

// const TableDashboardReadOnly = ({ data }) => {
//   const [selectedRow, setSelectedRow] = useState(null);
//   const dispatch = useDispatch();
//   const searchingData = useSelector((state) => state.app.searchingData);

//   const openDrawer = useSelector((state) => state.app.openDrawer);
//   useEffect(() => {
//     dispatch(set_demande_data_table(data));
//     dispatch(set_data_searching(data));
//   }, [dispatch]);

//   const handleDetails = (row) => {
//     setSelectedRow(row);
//     dispatch(set_drawer(true));
//   };
//   const handleCloseDrawer = () => {
//     dispatch(set_drawer(false));
//   };

//   const columns = [
//     {
//       title: "id",
//       dataIndex: "id",
//       width: 60,
//       sorter: (a, b) => a.id - b.id,
//     },
//     {
//       title: () => {
//         return (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <SearchComponent />
//           </div>
//         );
//       },
//       dataIndex: "numDemandeMUS",
//       sorter: (a, b) => a.numDemandeMUS.localeCompare(b.numDemandeMUS),
//     },
//     {
//       title: "Site",
//       dataIndex: "site",
//       filters: [...new Set(data.map((d) => d.site))].map((site) => ({
//         text: site,
//         value: site,
//       })),
//       onFilter: (value, record) => record.site === value,
//     },
//     {
//       title: "Projet",
//       dataIndex: "projet",
//     },
//     {
//       title: "Séquence",
//       dataIndex: "sequence",
//     },
//     {
//       title: "Quantité",
//       dataIndex: "Qte_demande",
//       sorter: (a, b) => a.Qte_demande - b.Qte_demande,
//     },
//     {
//       title: "Date Création",
//       dataIndex: "date_creation",
//       sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
//     },
//     {
//       title: "Statut",
//       dataIndex: "status",
//       width: 100,
//       align: "center",
//       filters: [...new Set(data.map((d) => d.status))].map((status) => ({
//         text: status,
//         value: status,
//       })),
//       onFilter: (value, record) => record.status === value,
//       render: (status) => {
//         const tagProps = {
//           Cloturé: {
//             icon: (
//               <RxCheckCircled
//                 color={COLORS.GREEN}
//                 size={ICONSIZE.PRIMARY}
//               />
//             ),
//           },
//           "En cours": {
//             icon: (
            //                 <TbHistory color={COLORS.Blue} strokeWidth={1.7} size={ICONSIZE.XLARGE}  />
            
//             ),
//           },
//           "Hors stock": {
//             icon: (
//               <IoCloseCircleOutline
//                 color={COLORS.LearRed}
//                 size={ICONSIZE.PRIMARY}
//               />
//             ),
//           },
//         };
//         return (
//           <div className="d-flex justify-content-center">
//             <Tooltip title={status}>{tagProps[status]?.icon}</Tooltip>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       width: 50,
//       render: (_, row) => (
//         <div className="d-flex justify-content-center">
//           <div className="pe-2">
//             <Tooltip title="Détails">
//               <div className="icon-wrapper" onClick={() => handleDetails(row)}>
//                 <IoDocumentText color={COLORS.Blue} size={ICONSIZE.SMALL} />
//               </div>
//             </Tooltip>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     searchingData && (
//       <>
//         <Table
//           rowClassName={() => "ant-row-no-hover"}
//           bordered
//           columns={columns}
//           dataSource={searchingData}
//           size="small"
//           locale={{
//             emptyText: <Empty description="Aucune donnée trouvée" />,
//           }}
//           pagination={{
//             position: ["bottomCenter"],
//             showSizeChanger: true,
//             pageSizeOptions: ["5", "10", "50", "100"],

//             showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
//           }}
//         />
//         <DrawerComponent
//           open={openDrawer}
//           handleCloseDrawer={handleCloseDrawer}
//           row={selectedRow}
//         />
//       </>
//     )
//   );
// };
// export default TableDashboardReadOnly;
