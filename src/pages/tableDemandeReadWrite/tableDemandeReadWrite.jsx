import React, { useEffect, useState } from "react";
import { Modal, Spin, Table, Tag, Tooltip, Empty, Divider } from "antd";
import { FaBoxOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../redux/slices";
import {
  CloseCircleOutlined,
  DeleteFilled,
  SyncOutlined,
} from "@ant-design/icons";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TbChecklist } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

import DrawerComponent from "../../components/drawer/drawerComponent";

import { COLORS } from "../../constant/colors";
import { ICONSIZE } from "../../constant/FontSizes";
import "./tableDemandeReadWrite.css";

const TableDemandeReadWrite = ({ data }) => {
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);
  const openDrawer = useSelector((state) => state.app.openDrawer);
  const role = useSelector((state) => state.app.role);

  const [selectedRow, setSelectedRow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const isLoading = useSelector(state => state.app.isLoading)

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
      width: 90,
      render: (_, row) => (
        <div className="d-flex justify-content-center">
          <div className={role == "Admin" ? "pe-2" :"pe-3"}>
            <Tooltip title="Détails">
              <div className="icon-wrapper" onClick={() => handleDetails(row)}>
                <FaBoxOpen color={COLORS.Blue} size={ICONSIZE.SMALL} />
              </div>
            </Tooltip>
          </div>
          <div className={role == "Admin" ? "pe-2" :""}>
            <Tooltip title="Valider">
              <div className="icon-wrapper" onClick={() => setVisible(true)}>
                <IoIosCheckmarkCircle
                  color={COLORS.GREEN}
                  size={ICONSIZE.SMALL}
                />
              </div>
            </Tooltip>
          </div>
          <div>
            {role == "Admin" && (
              <Tooltip placement="bottomLeft" title="Supprimer">
                <div
                  onClick={() => setVisibleDelete(true)}
                  className="icon-wrapper"
                >
                  <MdDelete color={COLORS.LearRed} size={ICONSIZE.SMALL} />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Confirmation"
        open={visible}
        onOk={() => alert("Confirmé")}
        onCancel={() => setVisible(false)}
        okText="Oui"
        cancelText="Annuler"
      >
        <p>Voulez-vous terminé cette action ?</p>
      </Modal>
      {role == 'Admin' && <Modal
        title="Confirmation"
        open={visibleDelete}
        onOk={() => alert("Confirmé")}
        onCancel={() => setVisibleDelete(false)}
        okText="Oui"
        cancelText="Annuler"
      >
        <p>Voulez-vous supprimer cette action ?</p>
      </Modal>}

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
