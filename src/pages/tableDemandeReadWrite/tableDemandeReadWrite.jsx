import React, { useEffect, useState } from "react";
import { Modal, Spin, Table, Tag, Tooltip, Empty, Divider, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../redux/slices";
import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

import DrawerComponent from "../../components/drawer/drawerComponent";

import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import "./tableDemandeReadWrite.css";

import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import ClickingIcon from "../../components/clickingIcon/clickingIcon";
import { IoDocumentText } from "react-icons/io5";


const TableDemandeReadWrite = ({ data }) => {
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);
  const openDrawer = useSelector((state) => state.app.openDrawer);
  const role = useSelector((state) => state.app.role);

  const [selectedRow, setSelectedRow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const isLoading = useSelector((state) => state.app.isLoading);

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
      title: "Numéro demande",
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
      title: "Date création",
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
            icon: <AiOutlineCheckCircle size={ICONSIZE.XSMALL} />,
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
      width: role == "Admin" ? 90 : 80,
      render: (_, row) => (
        <div className="d-flex justify-content-around">
          <div>
            <Tooltip title="Détails">
              <div className="icon-wrapper" onClick={() => handleDetails(row)}>
                <IoDocumentText color={COLORS.Blue} size={ICONSIZE.SMALL + 1} />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Valider">
              <div className="icon-wrapper" onClick={() => setVisible(true)}>
                <HiMiniDocumentCheck
                  color={COLORS.GREEN}
                  size={ICONSIZE.SMALL + 1}
                />
              </div>
            </Tooltip>
          </div>
          {role == "Admin" && (
            <div>
              <Tooltip placement="bottomLeft" title="Supprimer">
                <div
                  onClick={() => setVisibleDelete(true)}
                  className="icon-wrapper"
                >
                  <MdDelete color={COLORS.LearRed} size={ICONSIZE.SMALL + 1} />
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Terminer Modal  */}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HiMiniDocumentCheck
              size={ICONSIZE.SMALL}
              style={{ color: COLORS.GREEN }}
            />
            <span style={{ fontSize: FONTSIZE.PRIMARY, color: COLORS.GREEN }}>
              Confirmation
            </span>
          </div>
        }
        open={visible}
        footer={[
          <div className="d-flex justify-content-end">
            <div className="pe-3" onClick={() => setVisible(false)}>
              <ClickingIcon name={"Non"} />
            </div>
            <div onClick={() => alert("Terminé")}>
              <ClickingIcon
                color={COLORS.GREEN}
                icon={<HiMiniDocumentCheck color={COLORS.GREEN} />}
                name={"Oui"}
              />
            </div>
          </div>,
        ]}
      >
        <Alert message="Voulez-vous terminer cette demande?" type="success" />
        <p style={{ fontSize: FONTSIZE.PRIMARY }}></p>
      </Modal>

      {/* Delete Modal  */}
      {role == "Admin" && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AiFillCloseCircle
                size={ICONSIZE.SMALL}
                style={{ color: COLORS.LearRed }}
              />
              <span
                style={{ fontSize: FONTSIZE.PRIMARY, color: COLORS.LearRed }}
              >
                Supprimer
              </span>
            </div>
          }
          open={visibleDelete}
          onOk={() => alert("Supprimé")}
          onCancel={() => setVisibleDelete(false)}
          okText="Oui"
          cancelText="Non"
          footer={[
            <div className="d-flex justify-content-end">
              <div className="pe-3" onClick={() => setVisibleDelete(false)}>
                <ClickingIcon name={"Non"} />
              </div>
              <div onClick={() => alert("Supprimé")}>
                <ClickingIcon
                  color={COLORS.LearRed}
                  icon={<AiFillCloseCircle color={COLORS.LearRed} />}
                  name={"Oui"}
                />
              </div>
            </div>,
          ]}
        >
          <Alert message=" Voulez-vous supprimer cette demande?" type="error" />
        </Modal>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin size="middle" />
        </div>
      ) : (
        <Table
          className="custom-table"
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
            emptyText: <Empty description="Aucune donnée trouvée" />,
          }}
          size="small"
        />
      )}

      <DrawerComponent
        open={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
        row={selectedRow}
      />
    </>
  );
};

export default TableDemandeReadWrite;
