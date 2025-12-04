import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  check_massive_stock_api,
  update_massive_stock_api,
} from "../../api/update_massive_stock_api";
import {
  Button,
  Modal,
  notification,
  Spin,
  Table,
  Tooltip,
  Upload,
} from "antd";
import {
  openNotification,
  openNotificationSuccess,
} from "../notificationComponent/openNotification";
import { MdOutlineFileUpload } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
import { RiErrorWarningFill } from "react-icons/ri";
import { COLORS } from "../../constant/colors";
import SharedButton from "../button/button";
const columns = [
  { title: "Projet", dataIndex: "projetNom" },
  { title: "Site", dataIndex: "site" },

  { title: "Part Number", dataIndex: "partNumber" },

  { title: "Pattern", dataIndex: "patternNumb" },
  { title: "Bin de stockage", dataIndex: "bin_code" },
  {
    title: "Bin distination",
    dataIndex: "bin_code_distination",
  },
  { title: "Qte par bin", dataIndex: "quantiteBin" },
  { title: "Emetteur", dataIndex: "emetteur" },
];

const columns_check = [
  {
    title: "Part Number",
    dataIndex: "partNumber",
    render: (text, record) => {
      return record.reasonPN ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>{text}</p>
          <Tooltip placement="rightTop" title={record.reasonPN}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : (
        <p>{text}</p>
      );
    },
  },
  {
    title: "Pattern",
    dataIndex: "pattern",
    render: (text, record) => {
      return record.reasonPattern ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>{text}</p>
          <Tooltip placement="rightTop" title={record.reasonPattern}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : (
        <p>{text}</p>
      );
    },
  },
  {
    title: "Projet",
    dataIndex: "projetNom",
    render: (text, record) => {
      return record.reasonProjet ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>{text}</p>
          <Tooltip placement="rightTop" title={record.reasonProjet}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : (
        <p>{text}</p>
      );
    },
  },
  {
    title: "Site",
    dataIndex: "site",
    render: (text, record) => {
      return record.reasonSite ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>{text}</p>
          <Tooltip placement="rightTop" title={record.reasonSite}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : (
        <p>{text}</p>
      );
    },
  },
  {
    title: "Bin de stockage",
    dataIndex: "binChangement",
    render: (text, record) => {
      return record.reasonBin ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>
            {record.bin_code}{" "}
            {record.bin_code_distination && `-> ${record.bin_code_distination}`}
          </p>
          <Tooltip placement="rightTop" title={record.reasonBin}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : record.binChangement && record.binChangement.length >= 2 ? (
        <div>
          <p>
            {record.binChangement[0]} {" -> "}
            <b>{record.binChangement[1]}</b>
          </p>
        </div>
      ) : (
        <p>{record.bin_code}</p>
      );
    },
  },
  {
    title: "Qte par bin",
    dataIndex: "qteChangement",
    render: (text, record) => {
      return record.reasonQTE ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>{record.quantiteBin}</p>
          <Tooltip placement="rightTop" title={record.reasonQTE}>
            <RiErrorWarningFill size={ICONSIZE.XSMALL} />
          </Tooltip>
        </div>
      ) : record.qteChangement && record.qteChangement.length >= 2 ? (
        <div>
          <p>
            <span>{record.qteChangement[0]}</span>
            {record.qteChangement[0] && " -> "}
            <b>{record.qteChangement[1]} </b>
          </p>
        </div>
      ) : (
        <p>{record.quantiteBin}</p>
      );
    },
  },
  {
    title: "Emetteur",
    dataIndex: "emetteur",
    render: (text, record) => {
      console.log("Emetteur record:", record);

      if (record.reasonEmetteur) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{record.emetteur || ""}</span>
            <Tooltip placement="rightTop" title={record.reasonEmetteur}>
              <RiErrorWarningFill size={ICONSIZE.XSMALL} />
            </Tooltip>
          </div>
        );
      } else if (record.emetteur && record.emetteur.trim().length > 0) {
        return <span>{record.emetteur}</span>;
      } else {
        return <span>N/A</span>;
      }
    },
  },
];

export const ExcelReader = ({
  fetchFunction,
  fetchAllBins,
  fetchMouvement,
}) => {
  const token = useSelector((state) => state.app.tokenValue);
  const id_userMUS = useSelector((state) => state.app.userId);
  const [api, contextHolder] = notification.useNotification();
  const [checkMassiveArray, setCheckMassive] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLoading, setLoadingCheck] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [fileList, setFileList] = useState([]);
  const isLoading = useSelector((state) => state.app.isLoading);
  const [updatingData, setUpdatingData] = useState([]);

  const getExpectedHeaders = () => columns.map((c) => c.title);

  const validateRow = (row) => {
    if (row.quantite !== undefined && isNaN(Number(row.quantite))) {
      return `Invalid data type for "Qte en stock". Expected a number.`;
    }
  };

  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const arrayBuffer = evt.target.result;
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const wsname = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsname];
          const jsonSheet = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
          });

          if (jsonSheet.length === 0) {
            return reject("Le fichier est vide");
          }

          const actualHeaders = jsonSheet[0].map((h) => h.trim());
          const expectedHeaders = getExpectedHeaders();

          const missingHeaders = expectedHeaders.filter(
            (h) => !actualHeaders.includes(h)
          );
          if (missingHeaders.length > 0) {
            console.log("----------missingHeaders---------", missingHeaders);

            return reject(
              `Le fichier ne contient pas les en-têtes obligatoires suivants: ${missingHeaders.join(
                ", "
              )}`
            );
          }

          const extraHeaders = actualHeaders.filter(
            (h) => !expectedHeaders.includes(h)
          );
          if (extraHeaders.length > 0) {
            return reject(
              `Le fichier contient des en-têtes inconnus: ${extraHeaders.join(
                ", "
              )}`
            );
          }

          const processedData = [];
          const headerMap = Object.fromEntries(
            expectedHeaders.map((title, i) => [title, columns[i].dataIndex])
          );

          for (let i = 1; i < jsonSheet.length; i++) {
            const row = jsonSheet[i];
            if (
              !row ||
              row.every((cell) => cell === undefined || cell === "")
            ) {
              continue;
            }
            const rowData = {};

            expectedHeaders.forEach((header, index) => {
              const dataIndex = headerMap[header];
              rowData[dataIndex] = row[index];
            });

            const rowError = validateRow(rowData);

            if (rowError) {
              return reject(
                "La structure du fichier Excel utilisée est incorrecte."
              );
            }

            processedData.push(rowData);
          }

          resolve(processedData);
        } catch (err) {
          reject(
            "Erreur lors de l'analyse du fichier. Veuillez vérifier le format Excel."
          );
        }
      };

      reader.onerror = () => reject("Erreur lors de la lecture du fichier");
      reader.readAsArrayBuffer(file);
    });
  };
  const checkMassive = async (processedData) => {
    setLoadingCheck(true);
    console.log("processedData");
    console.log(processedData);

    const resCheck = await check_massive_stock_api(
      processedData,
      id_userMUS,
      token
    );
    console.log(resCheck);

    if (resCheck.resData) {
      setCheckMassive(resCheck.resData.details);
      const updating = resCheck.resData.details.filter(
        (row) => row.updated === true
      );
      setUpdatingData(updating);
      console.log("updating", updating);

      // if (resCheck?.resData?.updated > 0) {
      // setCheckMassive(resCheck.resData.details);
      // } else {
      //   openNotification(api, "Aucune mise à jour effectuée");
      //   setFileList([]);
      // }
    }
    setLoadingCheck(false);
  };
  const handleBeforeUpload = async (file) => {
    setFileList([file]);
    try {
      const rawData = await parseExcelFile(file);
      const processedData = rawData.filter((item) => {
        return Object.values(item).some((value) => value !== undefined);
      });
      await checkMassive(processedData);
    } catch (err) {
      openNotification(api, String(err));
      if (
        String(err).includes(
          "La structure du fichier Excel utilisée est incorrecte."
        )
      ) {
        setFileList([]);
      }
    }
    return false;
  };

  const handleConfirmUpload = async () => {
    if (fileList.length === 0) {
      openNotification(
        api,
        "Veuillez sélectionner un fichier Excel avant de confirmer"
      );
      return;
    }

    setLoadingConfirm(true);
    try {
      const processedData = await parseExcelFile(fileList[0]);

      const res = await update_massive_stock_api(
        updatingData,
        id_userMUS,
        token
      );
      if (res?.resData?.updated > 0) {
        openNotificationSuccess(api, "Mise à jour du stock réussie");
        fetchFunction();
        fetchAllBins();
        fetchMouvement();

        console.log(res?.resData);
      } else {
        openNotification(api, "Aucune mise à jour de quantité effectuée");
      }
    } catch (err) {
      openNotification(api, String(err));
      console.error(err);
    } finally {
      setLoadingConfirm(false);
      setFileList([]);
      setModalVisible(false);
      setCheckMassive([]);
    }
  };

  const handleCloseModal = async () => {
    setModalVisible(false);
    setFileList([]);
    setCheckMassive([]);
    setLoadingCheck(false);
  };

  const handleRomeFile = async () => {
    setFileList([]);
    setCheckMassive([]);
  };

  const getRowClassName = (record) => {
    if (record.updated) {
      return "ant-row-no-hover row-green";
    }
    if (!record.updated) {
      return "ant-row-no-hover red-row";
    }
    return "";
  };

  const hasErrors = checkMassiveArray.some(
    (item) =>
      item.reasonPN ||
      item.reasonPattern ||
      item.reasonProjet ||
      item.reasonSite ||
      item.reasonBin ||
      item.reasonQTE
  );

  return (
    <div>
      {contextHolder}

      <Modal
        width={800}
        title={<p style={{ margin: 0 }}>Modifier quantité du stock</p>}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Annuler
          </Button>,
          // <SharedButton
          //   loading={isLoading}
          //   disabled={hasErrors || checkMassiveArray.length === 0}
          //   type="primary"
          //   name="Confirmer"
          //   color={hasErrors ? "rgb(238 49 36 / 70%)" : COLORS.LearRed}
          //   callBack={handleConfirmUpload}
          // />,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmUpload}
            loading={loadingConfirm}
            color={COLORS.LearRed}
          >
            Confirmer
          </Button>,
        ]}
      >
        {!checkLoading ? (
          <div>
            <p style={{ marginBottom: 8 }}>
              Veuillez importer un fichier Excel contenant les colonnes
              requises.
            </p>

            <Upload
              width={800}
              beforeUpload={handleBeforeUpload}
              fileList={fileList}
              onRemove={handleRomeFile}
              accept=".xlsx,.xls"
              maxCount={1}
            >
              <Button icon={<MdOutlineFileUpload size={ICONSIZE.XSMALL} />}>
                Choisir un fichier Excel
              </Button>
            </Upload>
            {checkMassiveArray.length > 0 && (
              <div>
                <Table
                  rowClassName={getRowClassName}
                  style={{
                    padding: "13px 0 0 0",
                  }}
                  bordered
                  dataSource={checkMassiveArray}
                  columns={columns_check}
                  pagination={{
                    position: ["bottomCenter"],
                    showSizeChanger: true,
                    defaultPageSize: "100",
                    pageSizeOptions: ["5", "10", "25", "50", "100"],
                  }}
                  locale={{
                    emptyText: <p>Aucune donnée trouvée</p>,
                  }}
                  size="small"
                />
                {fileList.length > 0 && (
                  <p style={{ marginTop: 8, color: "green" }}>
                    {fileList[0].name} prêt à être importé
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0px",
            }}
          >
            <Spin size="small" />
          </div>
        )}
      </Modal>
      <div
        style={{
          paddingRight: "8px",
        }}
      >
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Excel Upload
          <MdOutlineFileUpload size={ICONSIZE.XSMALL} />
        </Button>
      </div>
    </div>
  );
};
