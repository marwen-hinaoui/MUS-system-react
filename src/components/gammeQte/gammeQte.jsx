import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  notification,
  Row,
  Segmented,
  Space,
  Spin,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import CardComponent from "../../components/card/cardComponent";
import SearchComponent from "../searchComponent/searchComponent";
import { useDispatch, useSelector } from "react-redux";
import { rebuild_api } from "../../api/rebuild_api";
import { TbHistory, TbRefresh } from "react-icons/tb";
import { ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { change_status_gamme_api } from "../../api/change_status_gamme_api";
import { get_rebuild_prep_api } from "../../api/get_rebuild_prep_api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MdOutlineCancel, MdOutlineFileDownload } from "react-icons/md";
import { annuler_rebuild_api } from "../../api/annuler_rebuild_api";
import { get_rebuild_livree_api } from "../../api/get_rebuild_livree_api";
import { get_patterns_api } from "../../api/plt/get_patterns_api";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { ModalDetailsGamme } from "../../pages/rebuildGamme/components/modalDetailsGamme";
import { set_data_searching } from "../../redux/slices";
import { RxCheckCircled } from "react-icons/rx";
import {
  openNotification,
  openNotificationSuccess,
} from "../notificationComponent/openNotification";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

const options = ["Préparation en cours", "Mouvement Coiffes"];
const { RangePicker } = DatePicker;

export const GammeQte = () => {
  const [activeModalIndex, setActiveModalIndex] = useState({});
  const [rebuilData, setRebuilData] = useState([]);
  const [rebuilDataPrep, setRebuilDataPrep] = useState([]);
  const [rebuilDataLivree, setRebuilDataLivree] = useState([]);
  const [emptyCompeleted, setEmptyCompeleted] = useState(true);
  const [detailsModal, setDetailsModal] = useState(false);
  const [detailsModalPattern, setDetailsModalPattern] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [laodingComfirmation, setLoadingComfimation] = useState(false);
  const token = useSelector((state) => state.app.tokenValue);
  const [currentView, setCurrentView] = useState("Préparation en cours");
  const [qteRequest, setQteRequest] = useState(0);
  const [recordId, setRecordId] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [detailsModalAnnuler, setDetailsModalAnnuler] = useState(false);
  const [detailsModalLivree, setDetailsModalLivree] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [pn_, setPN] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState([]);

  const searchingData = useSelector((state) => state.app.searchingData);
  const isLoadingSlice = useSelector((state) => state.app.isLoading);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRebuild();
    fetchRebuilPreparation();
    fetchRebuilLivree();
  }, [dispatch]);

  const fetchRebuild = async () => {
    setLoading(true);
    const res = await rebuild_api(token);

    setRebuilData(res?.resData?.compeletedDataRebuild);
    dispatch(set_data_searching(res?.resData?.compeletedDataRebuild));

    if (res?.resData?.compeletedDataRebuild?.length > 0) {
      setEmptyCompeleted(false);
    }
    setLoading(false);
  };
  const handleCloseModal = () => {
    setSelectedItem({});
    setSelectedRow({});
    setSelectedRow({});
    setDetailsModalPattern(false);
  };
  const handleOpenModal = async (row, pn, qte) => {
    setSelectedRow(row);
    setLoadingComfimation(true);
    setDetailsModalPattern(true);
    const res = await get_patterns_api(pn, token);

    if (res.resData) {
      const updatedRows = res.resData.map((item) => {
        if (item.quantity) {
          return {
            ...item,
            quantity: item.quantity * qte,
          };
        }
        return item;
      });
      setSelectedItem(updatedRows);
      setPN(pn);
    }
    setLoadingComfimation(false);
  };

  const changeStatus = async (id = {}, statusRebuild, pn, qte, qteRequest) => {
    setLoadingComfimation(true);

    const res = await change_status_gamme_api(
      statusRebuild === "Préparation en cours"
        ? {
            pn,
            qte,
            statusRebuild,
            qteRequest,
          }
        : { id, statusRebuild },
      token
    );

    if (res?.resData) {
      fetchRebuild();
      setActiveModalIndex({});
      fetchRebuilPreparation();
      fetchRebuilLivree();
      openNotificationSuccess(api, res.resData.message);
    } else if (res?.resError?.status === 400) {
      console.log(res);

      openNotification(api, res?.resError?.response?.data?.message);
    }
    setLoadingComfimation(false);

    statusRebuild === "Préparation en cours"
      ? setDetailsModal(false)
      : setDetailsModalLivree(false);
  };

  const fetchRebuilPreparation = async () => {
    const res = await get_rebuild_prep_api(token);
    setRebuilDataPrep(res?.resData?.data);
  };
  const fetchRebuilLivree = async () => {
    const res = await get_rebuild_livree_api(token);
    setRebuilDataLivree(res?.resData?.data);
    console.log(res);
  };

  const annulerRebuild = async (id) => {
    setLoadingComfimation(true);
    const res = await annuler_rebuild_api(id, token);
    if (res?.resData) {
      fetchRebuild();
      fetchRebuilPreparation();
    }
    setDetailsModalAnnuler(false);
    setLoadingComfimation(false);
    setRecordId({});
  };

  const columns = [
    { title: "Id", dataIndex: "id", width: 60 },

    {
      title: "Part Number",
      dataIndex: "pn",
      filters: [...new Set(rebuilDataPrep?.map((d) => d.partNumber))].map(
        (pn) => ({
          text: pn,
          value: pn,
        })
      ),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    {
      title: "Projet",
      dataIndex: "projet",
      filters: [...new Set(rebuilDataPrep?.map((d) => d.projet))].map(
        (projet) => ({
          text: projet,
          value: projet,
        })
      ),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    { title: "Quantité", dataIndex: "qte", width: 150 },
    {
      title: "Date",
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
        if (!value || value?.length === 0) return true;
        const recordDate = dayjs(record.date_creation, "YYYY-MM-DD");
        return (
          recordDate.isSame(value[0], "day") ||
          recordDate.isSame(value[1], "day") ||
          (recordDate.isAfter(value[0], "day") &&
            recordDate.isBefore(value[1], "day"))
        );
      },
    },

    {
      title: "Heure",
      dataIndex: "heure_creation",
    },
    {
      title: "Status",
      dataIndex: "status_rebuild",
      filters: [...new Set(rebuilDataPrep?.map((d) => d.status_rebuild))].map(
        (status_rebuild) => ({
          text: status_rebuild,
          value: status_rebuild,
        })
      ),
      onFilter: (value, record) => record.patternNumb === value,
      filterSearch: true,
      render: (text) => {
        return (
          <p>
            <TbHistory
              color={COLORS.Blue}
              strokeWidth={1.7}
              size={ICONSIZE.SMALL}
            />
            <span style={{ paddingLeft: "5px" }}>{text}</span>
          </p>
        );
      },
    },

    {
      title: "Action",
      width: 80,
      align: "center",

      render: (_, row) => (
        <div className="d-flex justify-content-center">
          <div>
            <div
              style={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => handleOpenModal(row, row.pn, row.qte)}
            >
              Voir
            </div>
          </div>
        </div>
      ),
    },
  ];
  const columns_livree = [
    { title: "Id", dataIndex: "id", width: 60 },

    {
      title: "Part Number",
      dataIndex: "pn",
      filters: [...new Set(rebuilDataPrep?.map((d) => d.partNumber))].map(
        (pn) => ({
          text: pn,
          value: pn,
        })
      ),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    {
      title: "Projet",
      dataIndex: "projet",
      filters: [...new Set(rebuilDataPrep?.map((d) => d.projet))].map(
        (projet) => ({
          text: projet,
          value: projet,
        })
      ),
      onFilter: (value, record) => record.partNumber === value,
      filterSearch: true,
    },
    { title: "Quantité", dataIndex: "qte", width: 150 },
    {
      title: "Date",
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
        if (!value || value?.length === 0) return true;
        const recordDate = dayjs(record.date_creation, "YYYY-MM-DD");
        return (
          recordDate.isSame(value[0], "day") ||
          recordDate.isSame(value[1], "day") ||
          (recordDate.isAfter(value[0], "day") &&
            recordDate.isBefore(value[1], "day"))
        );
      },
    },

    {
      title: "Heure",
      dataIndex: "heure_creation",
    },
    {
      title: "Status",
      dataIndex: "status_rebuild",

      render: (text) => {
        return (
          <p>
            <IoCheckmarkCircleOutline
              color={COLORS.GREEN}
              strokeWidth={1.7}
              size={ICONSIZE.SMALL}
            />
            <span style={{ paddingLeft: "5px" }}>{text}</span>
          </p>
        );
      },
    },
  ];

  dayjs.extend(customParseFormat);

  const exportToExcel = () => {
    const exportSchema = [
      { header: "Id", dataIndex: "id" },
      { header: "Part Number", dataIndex: "pn" },
      { header: "Projet", dataIndex: "projet" },
      { header: "Quantité", dataIndex: "qte" },
      { header: "Date", dataIndex: "date_creation" },
      { header: "Projet", dataIndex: "projet" },
      { header: "Heure", dataIndex: "heure_creation" },
      { header: "Status", dataIndex: "status_rebuild" },
    ];

    if (!rebuilDataLivree || rebuilDataLivree.length === 0) {
      openNotification(api, "Aucune donnée à exporter !");
      return;
    }

    let filteredData = rebuilDataLivree;
    const [start, end] = exportDateRange;

    if (exportDateRange && exportDateRange.length === 2) {
      console.log(exportDateRange);

      filteredData = rebuilDataLivree.filter((item) => {
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
    const formattedData = filteredData.map((record) => {
      return exportSchema.reduce((obj, column) => {
        const key = column.dataIndex;
        obj[key] = record[key] || "";
        return obj;
      }, {});
    });
    const headers = exportSchema.map((col) => col.header);
    const headerKeys = exportSchema.map((col) => col.dataIndex);

    const worksheet = XLSX.utils.json_to_sheet(formattedData, {
      header: headerKeys,
    });
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes");
    let fileName = "";
    if (!start || !end) {
      const today = new Date();
      const todayISO = today.toISOString().split("T")[0];
      fileName = `Demandes_MUS_${todayISO}.xlsx`;
    } else {
      fileName = `Mouvement_coiffes_${start?.$D}/${start?.$M + 1}/${
        start?.$y
      } - ${end?.$D}/${end?.$M + 1}/${end?.$y}.xlsx`;
    }

    const dataBlob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );
    saveAs(dataBlob, fileName);
  };
  return (
    <div>
      {contextHolder}

      <Modal
        title="Exporter Mouvement Coiffes"
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

      {!isLoading &&
      !isLoadingSlice &&
      !emptyCompeleted &&
      searchingData?.length > 0 ? (
        <div>
          <Row
            style={{
              maxHeight: "50vh",
              paddingBottom: "16px",
              overflowY: "scroll",
            }}
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            // justify={rebuilData?.length <= 3 && "center"}
          >
            {searchingData.map((item, index) => (
              <Col
                key={index}
                span={6}
                style={{
                  paddingBottom: "8px",
                  paddingRight: "8px",
                }}
              >
                <CardComponent
                  callback={() => {
                    setQteRequest(
                      item.resultFromRebuilService.totalGammePossbile
                    );
                    setActiveModalIndex(item);
                    setDetailsModal(true);
                  }}
                  padding={"10px"}
                  cursor={true}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: 12,
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
                        {item.resultFromRebuilService.pn}
                      </p>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                        {item.projet}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>
                        Qte
                      </p>

                      <p
                        style={{
                          fontSize: 15,
                          color: "#6b7280",
                          margin: 0,
                          padding: "0 5px 0 0",
                        }}
                      >
                        {":"}
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          margin: 0,
                          paddingRight: "5px",
                        }}
                      >
                        {item.resultFromRebuilService.totalGammePossbile}
                      </p>
                    </div>
                  </div>
                  <div></div>
                </CardComponent>
              </Col>
            ))}
          </Row>
        </div>
      ) : !isLoading && !isLoadingSlice ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <p>Aucune donnée trouvée</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <Spin size="small" />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Segmented
          options={options}
          onChange={(value) => setCurrentView(value)}
          value={currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        />
      </div>

      <Modal
        title={<p style={{ margin: 0 }}>Confirmation</p>}
        open={detailsModal}
        onCancel={() => setDetailsModal(false)}
        footer={[]}
      >
        <p style={{ marginBottom: 8, marginTop: -8 }}>
          Veuillez indiquer la quantité que vous souhaitez reconstituer :
        </p>

        <Form
          onFinish={() =>
            changeStatus(
              {},
              "Préparation en cours",
              activeModalIndex?.resultFromRebuilService?.pn,
              activeModalIndex?.resultFromRebuilService?.totalGammePossbile,
              qteRequest,
              activeModalIndex?.projet
            )
          }
          form={form}
        >
          <Form.Item
            name="quantity"
            initialValue={qteRequest}
            rules={[
              { required: true, message: "Veuillez saisir une quantité." },
              {
                validator: (_, value) =>
                  value >
                  activeModalIndex?.resultFromRebuilService?.totalGammePossbile
                    ? Promise.reject(
                        new Error(
                          `La quantité maximale est ${activeModalIndex?.resultFromRebuilService?.totalGammePossbile}.`
                        )
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <InputNumber
              onChange={(value) => setQteRequest(value)}
              value={
                activeModalIndex?.resultFromRebuilService?.totalGammePossbile
              }
              min={1}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Form.Item style={{ margin: 0, paddingRight: "8px" }}>
              <Button
                key="cancel"
                danger
                onClick={() => setDetailsModal(false)}
              >
                Annuler
              </Button>
            </Form.Item>
            <Form.Item style={{ margin: 0 }}>
              <Button
                key="confirm"
                type="primary"
                htmlType="submit"
                loading={laodingComfirmation}
              >
                Confirmer
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title={<p style={{ margin: 0 }}>Confirmation</p>}
        open={detailsModalAnnuler}
        onCancel={() => setDetailsModalAnnuler(false)}
        footer={[
          <Button
            key="cancel"
            danger
            onClick={() => setDetailsModalAnnuler(false)}
          >
            Annuler
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => annulerRebuild(recordId)}
            loading={laodingComfirmation}
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
          Voulez-vous annuler cette coiffe ?
        </p>
      </Modal>
      <Modal
        title={<p style={{ margin: 0 }}>Confirmation</p>}
        open={detailsModalLivree}
        onCancel={() => setDetailsModalLivree(false)}
        footer={[
          <Button
            key="cancel"
            danger
            onClick={() => setDetailsModalLivree(false)}
          >
            Annuler
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => changeStatus(recordId, "Livrée")}
            loading={laodingComfirmation}
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
          Cette coiffe est-elle prête à être livrée ?
        </p>
      </Modal>
      {currentView === "Préparation en cours" && (
        <>
          <ModalDetailsGamme
            pn={pn_}
            action={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    console.log(selectedItem);
                    setRecordId(selectedRow.id);
                    setDetailsModalAnnuler(true);
                    handleCloseModal();
                  }}
                >
                  <MdOutlineCancel size={ICONSIZE.SMALL} /> Annuler la
                  reconstitution
                </Button>
                <div style={{ padding: "0 5px 0 0" }}></div>
                <Button
                  style={{
                    padding: "10px",
                    border: "none",
                    background: COLORS.GREEN,
                    color: COLORS.WHITE,
                  }}
                  onClick={() => {
                    setRecordId(selectedRow.id);
                    setDetailsModalLivree(true);
                    handleCloseModal();
                  }}
                >
                  <RxCheckCircled size={ICONSIZE.SMALL - 1} /> Confirmer la
                  reconstitution
                </Button>
              </div>
            }
            isLoading={laodingComfirmation}
            isChangeStatusPage={true}
            patterns={selectedItem}
            detailsModal={detailsModalPattern}
            setDetailsModal={handleCloseModal}
          />
          <Table
            style={{
              padding: "13px 0 0 0",
            }}
            bordered
            dataSource={rebuilDataPrep}
            columns={columns}
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
        </>
      )}
      {currentView === "Mouvement Coiffes" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              style={{
                float: "right",
              }}
              type="primary"
              onClick={() => setIsExportModalOpen(true)}
            >
              Export Excel <MdOutlineFileDownload size={ICONSIZE.XSMALL} />
            </Button>
          </div>
          <Table
            style={{
              padding: "13px 0 0 0",
            }}
            bordered
            dataSource={rebuilDataLivree}
            columns={columns_livree}
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
        </>
      )}
    </div>
  );
};
