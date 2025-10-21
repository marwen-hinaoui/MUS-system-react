import { Modal, Spin, Table } from "antd";

export const ModalDetailsGamme = ({
  detailsModal,
  setDetailsModal,
  isLoading,
  isChangeStatusPage,
  patterns,
  action,
}) => {
  const columns = [
    { title: "Pattern PN", dataIndex: "patternPN", width: 300 },
    { title: "Pattern N°", dataIndex: "pattern", width: 100 },
    { title: "Qte par Coiffe", dataIndex: "quantity", width: 100 },
    { title: "Qte en stock", dataIndex: "available", width: 100 },
    {
      title: "Coiffe possibile",
      dataIndex: "possible",
      width: 100,
    },
    {
      title: "Qte manquante",
      dataIndex: "missing",
      width: 100,
    },
  ];

  const columns_2 = [
    { title: "Pattern PN", dataIndex: "pattern" },
    { title: "Pattern N°", dataIndex: "panel_number" },
    { title: "Quantité", dataIndex: "quantity" },
  ];
  const getRowClassName = (record) => {
    if (record.missing > 0) {
      return "ant-row-no-hover red-row";
    }
    return "";
  };

  return (
    <div>
      <Modal
        width={800}
        title={<p style={{ margin: 0 }}>Détails coiffe</p>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={detailsModal}
        onCancel={() => setDetailsModal()}
        footer={[]}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Spin size="small" />
          </div>
        ) : (
          <>
            <Table
              style={{
                padding: "13px 0 0 0",
              }}
              rowClassName={getRowClassName}
              bordered
              columns={isChangeStatusPage ? columns_2 : columns}
              dataSource={patterns}
              pagination={{
                position: ["bottomCenter"],
                showSizeChanger: true,
                defaultPageSize: "10",
                pageSizeOptions: ["5", "10", "25", "50", "100"],
              }}
              locale={{
                emptyText: <p>Aucune donnée trouvée</p>,
              }}
              size="small"
            />
            {action}
          </>
        )}
      </Modal>
    </div>
  );
};
