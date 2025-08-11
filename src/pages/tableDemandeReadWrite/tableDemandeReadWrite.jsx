import React, { useEffect, useState } from "react";
import { Table, Tooltip, Empty, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../redux/slices";

import DrawerComponent from "../../components/drawer/drawerComponent";

import { COLORS } from "../../constant/colors";
import { ICONSIZE } from "../../constant/FontSizes";
import "./tableDemandeReadWrite.css";

import { AiOutlineCheckCircle, AiOutlineHistory } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import SearchComponent from "../../components/searchComponent/searchComponent";

const TableDemandeReadWrite = ({ data }) => {
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);
  const openDrawer = useSelector((state) => state.app.openDrawer);
  const role = useSelector((state) => state.app.role);

  const [selectedRow, setSelectedRow] = useState(null);
  // const isLoading = useSelector((state) => state.app.isLoading);

  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data));
  }, [dispatch, data]);

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
    },
    {
      title: () => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchComponent />
          </div>
        );
      },
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
      filters: [...new Set(data.map((d) => d.projet))].map((projet) => ({
        text: projet,
        value: projet,
      })),
      onFilter: (value, record) => record.projet === value,
    },
    {
      title: "Part number",
      dataIndex: "part_number",
    },
    {
      title: "Date création",
      dataIndex: "date_creation",
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
    },
    {
      title: "Statut",
      dataIndex: "status",

      filters: [...new Set(data.map((d) => d.status))].map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const tagProps = {
          Cloturé: {
            icon: (
              <AiOutlineCheckCircle
                color={COLORS.GREEN}
                size={ICONSIZE.PRIMARY}
              />
            ),
          },
          "En cours": {
            icon: (
              <AiOutlineHistory color={COLORS.Blue} size={ICONSIZE.PRIMARY} />
            ),
          },
          "Hors stock": {
            icon: (
              <IoCloseCircleOutline
                color={COLORS.LearRed}
                size={ICONSIZE.PRIMARY}
              />
            ),
          },
        };
        return (
          <div className="d-flex ">
            <p>
              {tagProps[status]?.icon}
              <span style={{paddingLeft:'5px'}}>{status}</span>
            </p>
          </div>
        );
      },
    },
    {
      title: "Détails",
      width: 80,
      align: "center",

      render: (_, row) => (
        <div className="d-flex justify-content-center">
          <div>
            <div
              style={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => handleDetails(row)}
            >
              Voir
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        rowClassName={() => "ant-row-no-hover"}
        className="custom-table"
        bordered
        columns={columns}
        dataSource={searchingData}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "25", "50", "100"],
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
        locale={{
          emptyText: <Empty description="Aucune donnée trouvée" />,
        }}
        size="small"
      />

      <DrawerComponent
        role={role}
        open={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
        row={selectedRow}
      />
    </>
  );
};

export default TableDemandeReadWrite;
