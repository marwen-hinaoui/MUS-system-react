import { Button, Checkbox, Modal, Select, Spin, Table } from "antd";
import { useState, useEffect } from "react";
import { HpglViewer } from "../../../components/patternViewer/patternViewer";
import { pattern_image_api } from "../../../api/plt/pattern_image_api";
import { IoClose } from "react-icons/io5";
import { ICONSIZE } from "../../../constant/FontSizes";
import { COLORS } from "../../../constant/colors";
const { Option } = Select;
export const ModalDetailsGamme = ({
  pn,
  detailsModal,
  setDetailsModal,
  isLoading,
  isChangeStatusPage,
  patterns,
  action,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paternImageModal, setPaternImageModal] = useState(false);
  const [patternPNNumberCode, setPatterPNCode] = useState({});
  const [patternsData, setPatternsData] = useState([]);
  const [detailsModalClose, setDetailsCloseModal] = useState(false);
  const [scaleValue, setScaleValue] = useState(0.03);
  useEffect(() => {
    if (Array.isArray(patterns)) {
      setPatternsData(patterns);
    } else {
      setPatternsData([]);
    }
  }, [patterns]);

  const handleModalOpenImage = async (patternPN) => {
    const res = await pattern_image_api(patternPN);
    setPatterPNCode(res?.resData?.hpglCode);
    setPaternImageModal(true);
  };
  const columns = [
    {
      title: "Pattern PN",
      dataIndex: "patternPN",
      width: 300,
      filters: Array.isArray(patternsData)
        ? [...new Set(patternsData.map((d) => d.patternPN))].map((pn) => ({
            text: pn,
            value: pn,
          }))
        : [],
      onFilter: (value, record) => record.patternPN === value,
      filterSearch: true,
    },
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
      render: (text, row) =>
        row.missing > 0 ? (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {text}
          </p>
        ) : (
          <p>{text}</p>
        ),
    },
  ];

  const columns_2 = [
    {
      title: "Pattern PN",
      dataIndex: "pattern",
      width: 300,
      filters: [...new Set(patternsData.map((d) => d.pattern))].map((pn) => ({
        text: pn,
        value: pn,
      })),
      onFilter: (value, record) => record.pattern === value,
      filterSearch: true,
    },
    { title: "Pattern N°", dataIndex: "panel_number" },
    {
      title: "Quantité",
      dataIndex: "quantity",
      render: (text) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            {text}
          </p>
          <Checkbox />
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 100,
      render: (_, row) => (
        <div
          style={{ cursor: "pointer", fontWeight: 500, textAlign: "center" }}
          onClick={() => handleModalOpenImage(row.pattern)}
        >
          Voir
        </div>
      ),
    },
  ];
  const handleChange = (value) => {
    setScaleValue(value);
  };
  const getRowClassName = (record) => {
    if (record.missing > 0) {
      return "ant-row-no-hover red-row";
    }
    return "";
  };

  useEffect(() => {
    if (!detailsModal) {
      setCurrentPage(1);
    }
  }, [detailsModal]);

  return (
    <>
      <Modal
        title={<p style={{ margin: 0 }}>Confirmation</p>}
        open={detailsModalClose}
        onCancel={() => setDetailsCloseModal(false)}
        footer={[
          <Button
            key="cancel"
            danger
            onClick={() => setDetailsCloseModal(false)}
          >
            Annuler
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              setDetailsModal();
              setDetailsCloseModal(false);
            }}
          >
            Confirmer
          </Button>,
        ]}
      >
        <p
          style={{
            marginBottom: "8px",
            marginTop: "-8px",
          }}
        >
          Voulez-vous fermer cette fenêtre ?
        </p>
      </Modal>
      <Modal
        width={800}
        title={<p style={{ margin: 0 }}>Image pattern</p>}
        open={paternImageModal}
        onCancel={() => setPaternImageModal(false)}
        footer={[]}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <p
              style={{
                paddingRight: "4px",
              }}
            >
              Scale:
            </p>
            <Select onChange={handleChange} defaultValue={scaleValue}>
              <Option value={0.02}>0.02</Option>
              <Option value={0.03}>0.03</Option>
              <Option value={0.04}>0.04</Option>
              <Option value={0.05}>0.05</Option>
              <Option value={0.06}>0.06</Option>
              <Option value={0.07}>0.07</Option>
              <Option value={0.09}>0.09</Option>
            </Select>
          </div>

          <div style={{ paddingTop: "10px" }}></div>
          <HpglViewer scale={scaleValue} hpglCode={patternPNNumberCode} />
        </div>
      </Modal>
      <Modal
        width={800}
        closable={false}
        title={
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0 }}>Détails coiffe</p>
              <IoClose
                cursor={"pointer"}
                onClick={() => setDetailsCloseModal(true)}
                color={COLORS.Gray3}
                size={ICONSIZE.PRIMARY}
              />
            </div>
            <p style={{ fontWeight: 500, margin: 0 }}>{pn}</p>
          </div>
        }
        open={detailsModal}
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
              style={{ padding: "13px 0 0 0" }}
              rowClassName={getRowClassName}
              bordered
              columns={isChangeStatusPage ? columns_2 : columns}
              dataSource={patterns}
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                position: ["bottomCenter"],
                showSizeChanger: true,
                defaultPageSize: 150,
                pageSizeOptions: ["5", "10", "25", "50", "150"],
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
    </>
  );
};
