import React, { useEffect, useState } from "react";
import { Table, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { set_data_searching, set_demande_data_table } from "../../redux/slices";

import { COLORS } from "../../constant/colors";
import { ICONSIZE } from "../../constant/FontSizes";
import "./tableDemandeReadWrite.css";

import { AiOutlineCheckCircle, AiOutlineHistory } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import SearchComponent from "../../components/searchComponent/searchComponent";
import {  useNavigate } from "react-router-dom";

const TableDemandeReadWrite = ({ data }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data));
  }, [dispatch, data]);

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
      dataIndex: "numDemande",
      sorter: (a, b) => a.numDemande.localeCompare(b.numDemande),
    },

    {
      title: "Séquence",
      dataIndex: "Sequence",
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
      title: "Date création",
      dataIndex: "date_creation",
      sorter: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
    },
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
              onClick={() => navigate(`details/${row.id}`, { state: { id: row.id } })}
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
