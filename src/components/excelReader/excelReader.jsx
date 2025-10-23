import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  check_massive_stock_api,
  update_massive_stock_api,
} from "../../api/update_massive_stock_api";
import { Button, Modal, notification, Spin, Table, Upload } from "antd";
import {
  openNotification,
  openNotificationSuccess,
} from "../notificationComponent/openNotification";
import { MdOutlineFileUpload } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";

const columns = [
  { title: "Projet", dataIndex: "projetNom" },
  { title: "Part Number", dataIndex: "partNumber" },
  { title: "Pattern", dataIndex: "patternNumb" },
  { title: "Matière", dataIndex: "partNumberMaterial" },
  { title: "Qte en stock", dataIndex: "quantite" },
];
const columns_check = [
  { title: "Part Number", dataIndex: "partNumber" },
  { title: "Pattern", dataIndex: "pattern" },
  {
    title: "Quantité",
    dataIndex: "qteChangement",
    render: (text, record) => {
      return (
        <div>
          <p>
            <span style={{ color: "#6b7280" }}>{record.qteChangement[0]}</span>
            {" -> "}
            <span>{record.qteChangement[1]} </span>
          </p>
        </div>
      );
    },
  },
];

export const ExcelReader = ({ qteStock, fetchFunction }) => {
  const token = useSelector((state) => state.app.tokenValue);
  const [api, contextHolder] = notification.useNotification();
  const [checkMassiveArray, setCheckMassive] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLoading, setLoadingCheck] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [fileList, setFileList] = useState([]);

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

    const resCheck = await check_massive_stock_api(processedData, token);
    if (resCheck.resData) {
      if (resCheck?.resData?.updated > 0) {
        setCheckMassive(resCheck.resData.details);
      } else {
        openNotification(api, "Aucune mise à jour de quantité effectuée");
        setFileList([]);
      }
    }
    setLoadingCheck(false);
  };
  const handleBeforeUpload = async (file) => {
    setFileList([file]);
    try {
      const processedData = await parseExcelFile(file);
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

      const res = await update_massive_stock_api(processedData, token);
      if (res?.resData?.updated > 0) {
        openNotificationSuccess(api, "Mise à jour du stock réussie");
        fetchFunction();
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
  };

  const handleRomeFile = async () => {
    setFileList([]);
    setCheckMassive([]);
  };

  return (
    <div>
      {contextHolder}

      <Modal
        title={<p style={{ margin: 0 }}>Modifier quantité du stock</p>}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" danger onClick={handleCloseModal}>
            Annuler
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmUpload}
            loading={loadingConfirm}
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

        {checkMassiveArray.length > 0 && (
          <div>
            <Table
              style={{
                padding: "13px 0 0 0",
              }}
              bordered
              dataSource={checkMassiveArray}
              columns={columns_check}
              pagination={{
                position: ["bottomCenter"],
                showSizeChanger: true,
                defaultPageSize: "5",
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
