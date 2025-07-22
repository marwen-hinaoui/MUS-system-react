import { Table } from "antd";
import { createStyles } from "antd-style";
import { Link } from "react-router-dom";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
const columns = [
  {
    title: "id",
    dataIndex: "id",
    key: "name",
    fixed: "id",
  },
  {
    title: "Numéro Demande",
    dataIndex: "numDemande",
    key: "age",
    fixed: "left",
  },

  { title: "User", dataIndex: "user", key: "1" },
  { title: "Site", dataIndex: "site", key: "5" },
  { title: "Projet", dataIndex: "projet", key: "6" },
  { title: "Lieu Défauet", dataIndex: "lieuDefaut", key: "2" },
  { title: "Qte Demandé", dataIndex: "Qte_demande", key: "3" },
  { title: "Défaut", dataIndex: "defaut", key: "4" },
  { title: "Date Creation", dataIndex: "date_creation", key: "4" },

  // {
  //   title: "Action",
  //   key: "operation",
  //   fixed: "right",
  //   width: 100,
  //   render: () => {
  //     <div></div>
  //   },
  // },
];
const dataSource = [
  {
    key: "1",
    id: "1",
    numDemande: "MUS1234567",
    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    defaut: "A777",
    Qte_demande: "3",
    lieuDefaut: "SEWING",
    date_creation: "28-12-2025",
  },
  {
    key: "2",
    id: "2",
    numDemande: "MUS1234567",
    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    defaut: "A777",
    Qte_demande: "3",
    lieuDefaut: "SEWING",
    date_creation: "28-12-2025",
  },
];
const TableDashboard = () => {
  const { styles } = useStyle();
  return (
    <Table
      bordered
      className={styles.customTable}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: "max-content" }}
    />
  );
};
export default TableDashboard;
