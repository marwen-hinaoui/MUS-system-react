import React, { useEffect, useState } from "react";
import {
  Table,
  Empty,
  DatePicker,
  Button,
  Space,
  Modal,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { set_data_searching, set_demande_data_table } from "../../redux/slices";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { COLORS } from "../../constant/colors";
import { ICONSIZE } from "../../constant/FontSizes";
import "./tableDemandeReadWrite.css";

import { TbHistory } from "react-icons/tb";
import { IoCloseCircleOutline } from "react-icons/io5";
import SearchComponent from "../../components/searchComponent/searchComponent";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { RxCheckCircled } from "react-icons/rx";
import { openNotification } from "../../components/notificationComponent/openNotification";
const TableDemandeReadWrite = ({ data }) => {
  const navigate = useNavigate();
  const [exportDateRange, setExportDateRange] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data));
  }, [dispatch, data]);

  const columns = [
    {
      title: "Id",
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
      dataIndex: "numDemande",
      sorter: (a, b) => a.numDemande.localeCompare(b.numDemande),
    },

    // {
    //   title: "Demandeur",
    //   dataIndex: "userFullName",
    //   render: (value, record) => {
    //     return <p>{`${record.firstName} ${record.lastName}`}</p>;
    //   },
    // },

    {
      title: "Demandeur",
      dataIndex: "demandeur",
    },
    {
      title: "Séquence",
      dataIndex: "sequence",
    },

    {
      title: "Site",
      dataIndex: "siteNom",
      filters: [...new Set(data.map((d) => d.siteNom))].map((site) => ({
        text: site,
        value: site,
      })),
      onFilter: (value, record) => record.siteNom === value,
    },
    {
      title: "Projet",
      dataIndex: "projetNom",
      filters: [...new Set(data.map((d) => d.projetNom))].map((projet) => ({
        text: projet,
        value: projet,
      })),
      onFilter: (value, record) => record.projetNom === value,
    },
    {
      title: "Heure",
      dataIndex: "heure",
    },
    {
      title: "Date création",
      dataIndex: "date_creation",

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            format="YYYY-MM-DD"
            value={selectedKeys[0] || []}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
            }}
            style={{ marginBottom: 8, display: "flex" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Filtrer
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Réinitialiser
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length === 0) return true;
        const recordDate = dayjs(record.date_creation, "YYYY-MM-DD");
        return (
          recordDate.isSame(value[0], "day") ||
          recordDate.isSame(value[1], "day") ||
          (recordDate.isAfter(value[0], "day") &&
            recordDate.isBefore(value[1], "day"))
        );
      },
    },
    // {
    //   title: "Date création",
    //   dataIndex: "date_creation",
    //   sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
    //   defaultSortOrder: "descend",
    // },
    {
      title: "Statut",
      dataIndex: "statusDemande",

      filters: [...new Set(data.map((d) => d.statusDemande))].map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.statusDemande === value,
      render: (status) => {
        const tagProps = {
          Cloturé: {
            icon: (
              <RxCheckCircled color={COLORS.GREEN} size={ICONSIZE.PRIMARY} />
            ),
          },
          "En cours": {
            icon: (
              <TbHistory
                color={COLORS.Blue}
                strokeWidth={1.7}
                size={ICONSIZE.SMALL}
              />
            ),
          },
          "Hors stock": {
            icon: (
              <IoCloseCircleOutline
                color={COLORS.LearRed}
                size={ICONSIZE.SMALL}
              />
            ),
          },
        };
        return (
          <div className="d-flex ">
            <p>
              {tagProps[status]?.icon}
              <span style={{ paddingLeft: "5px" }}>{status}</span>
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
              onClick={() =>
                navigate(`details/${row.id}`, { state: { id: row.id } })
              }
            >
              Voir
            </div>
          </div>
        </div>
      ),
    },
  ];

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    let filteredData = data;
    if (exportDateRange && exportDateRange.length === 2) {
      const [start, end] = exportDateRange;
      filteredData = data.filter((item) => {
        const itemDate = dayjs(item.date_creation, "YYYY-MM-DD");
        return (
          itemDate.isSame(start, "day") ||
          itemDate.isSame(end, "day") ||
          (itemDate.isAfter(start, "day") && itemDate.isBefore(end, "day"))
        );
      });
    }

    if (filteredData.length === 0) {
      openNotification(api, "Aucune donnée trouvée pour cette période !");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes");

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const fileName = `Demandes_MUS_${exportDateRange}.xlsx`;
    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );
    saveAs(dataBlob, fileName);
  };

  return (
    <>
      {contextHolder}

      <Modal
        title="Exporter Demandes"
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        onOk={() => exportToExcel()}
        okText="Exporter"
        cancelText="Annuler"
      >
        <RangePicker
          format="YYYY-MM-DD"
          value={exportDateRange}
          onChange={(dates) => setExportDateRange(dates)}
          style={{ width: "100%" }}
        />
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "17px",
        }}
      >
        <Button
          style={{
            float: "right",
          }}
          type="primary"
          onClick={() => setIsExportModalOpen(true)}
        >
          Export Excel
        </Button>
      </div>

      <Table
        rowClassName={() => "ant-row-no-hover"}
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
          emptyText: (
            <Empty
              description="Aucune donnée trouvée"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        size="small"
      />
    </>
  );
};

export default TableDemandeReadWrite;
