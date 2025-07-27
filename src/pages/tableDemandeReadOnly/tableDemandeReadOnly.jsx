import React, { useEffect, useState } from "react";
import { Divider, Empty, Spin, Table, Tag, Tooltip } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import { COLORS } from "../../constant/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../redux/slices";
import { ICONSIZE } from "../../constant/FontSizes";
import DrawerComponent from "../../components/drawer/drawerComponent";
import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { TbChecklist } from "react-icons/tb";
import { RiFileListFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";

const TableDashboardReadOnly = ({ data }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  const openDrawer = useSelector((state) => state.app.openDrawer);
  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data));
  }, [dispatch]);

  const handleDetails = (row) => {
    setSelectedRow(row);
    dispatch(set_drawer(true));
  };
  const handleCloseDrawer = () => {
    dispatch(set_drawer(false));
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "N° Demande",
      dataIndex: "numDemandeMUS",
      sorter: (a, b) => a.numDemandeMUS.localeCompare(b.numDemandeMUS),
    },
    {
      title: "Site",
      dataIndex: "site",
      filters: [...new Set(data.map((d) => d.site))].map((site) => ({
        text: site,
        value: site,
      })),
      onFilter: (value, record) => record.site === value,
    },
    {
      title: "Projet",
      dataIndex: "projet",
    },
    {
      title: "Séquence",
      dataIndex: "sequence",
    },
    {
      title: "Quantité",
      dataIndex: "Qte_demande",
      sorter: (a, b) => a.Qte_demande - b.Qte_demande,
    },
    {
      title: "Date Création",
      dataIndex: "date_creation",
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
    },
    {
      title: "Statut",
      dataIndex: "status",
      width: 100,
      align: "center",
      filters: [...new Set(data.map((d) => d.status))].map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const tagProps = {
          Terminé: {
            icon: <TbChecklist size={ICONSIZE.XSMALL} />,
            color: COLORS.GREEN,
          },
          "En cours": {
            icon: <SyncOutlined size={ICONSIZE.XSMALL} />,
            color: COLORS.Blue,
          },
          "Hors stock": {
            icon: <CloseCircleOutlined size={ICONSIZE.XSMALL} />,
            color: COLORS.LearRed,
          },
        };
        return (
          <Tag icon={tagProps[status]?.icon} color={tagProps[status]?.color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      width: 50,
      render: (_, row) => (
        <div className="d-flex justify-content-center">
          <div className="pe-2">
            <Tooltip title="Détails">
              <div className="icon-wrapper" onClick={() => handleDetails(row)}>
                <IoDocumentText color={COLORS.Blue} size={ICONSIZE.SMALL} />
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  return (
    searchingData && (
      <>
        <Table
          rowClassName={() => "ant-row-no-hover"}
          bordered
          columns={columns}
          dataSource={searchingData}
          size="small"
          locale={{
            emptyText: <Empty description="Aucune donnée trouvée" />,
          }}
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "50", "100"],

            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
          }}
        />
        <DrawerComponent
          open={openDrawer}
          handleCloseDrawer={handleCloseDrawer}
          row={selectedRow}
        />
      </>
    )
  );
};
export default TableDashboardReadOnly;
