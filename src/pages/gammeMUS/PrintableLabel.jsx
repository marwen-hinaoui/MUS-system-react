import React, { useRef, useState } from "react";
import { Divider, Modal, Select } from "antd";
import { HpglViewer } from "../../components/patternViewer/patternViewer";
import Barcode from "react-barcode";
import CardComponent from "../../components/card/CardComponent";
import { FONTSIZE } from "../../constant/FontSizes";
const { Option } = Select;

const PrintableLabel = ({ data, searchPN, desc, leatherPN, project }) => {
  const printRef = useRef();
  const [scaleValue, setScaleValue] = useState(0.03);
  const [paternImageModal, setPaternImageModal] = useState(false);
  const [patternPNNumberCode, setPatterPNCode] = useState({});
  const [selectedItem, setSelectedItem] = useState({});

  const handleModalOpenImage = (patternPN) => {
    setPatterPNCode(patternPN);
    setPaternImageModal(true);
  };
  const handleChange = (value) => {
    setScaleValue(value);
  };

  // const handlePrint = () => {
  //   const printContent = printRef.current;
  //   const windowPrint = window.open("", "", "width=1200,height=800");

  //   windowPrint.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Label</title>
  //         <style>
  //           @page {
  //             size: A4 landscape;
  //             margin: 10mm;
  //           }
  //           body {
  //             margin: 0;
  //             padding: 20px;
  //             font-family: Arial, sans-serif;
  //           }
  //           .print-container {
  //             width: 100%;
  //             page-break-after: always;
  //           }
  //           @media print {
  //             body {
  //               print-color-adjust: exact;
  //               -webkit-print-color-adjust: exact;
  //             }
  //             .no-print {
  //               display: none;
  //             }
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent.innerHTML}
  //       </body>
  //     </html>
  //   `);

  //   windowPrint.document.close();
  //   setTimeout(() => {
  //     windowPrint.print();
  //     windowPrint.close();
  //   }, 250);
  // };

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = today + " " + new Date().toTimeString().split(" ")[0];

  return (
    <CardComponent ref={printRef}>
      <div
        style={{
          width: "100%",
          position: "sticky",
          top: "66px",
          zIndex: 10,
          background: "#fff",
          display: "grid",
          gridTemplateColumns: "25% 25% 25% 25%",
          fontSize: FONTSIZE.PRIMARY,
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        {/* Parts Number */}
        <div
          style={{
            padding: "10px 5px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Part Number:
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Barcode
              value={searchPN || "N/A"}
              width={1.5}
              height={40}
              fontSize={12}
              margin={0}
            />
          </div>
        </div>
        {/* Description */}
        <div
          style={{
            padding: "10px 5px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Description:
          </div>
          <div
            style={{
              fontSize: FONTSIZE.XPRIMARY - 1,
              flex: 1,
            }}
          >
            {desc || "N/A"}
          </div>
        </div>
        <div
          style={{
            padding: "10px 5px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Leather Kit:
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            {leatherPN !== "N/A" ? (
              <Barcode
                value={leatherPN !== "N/A" ? leatherPN : "N/A"}
                width={1.5}
                height={40}
                fontSize={12}
                margin={0}
              />
            ) : (
              <p style={{ fontSize: FONTSIZE.XPRIMARY - 1 }}>N/A</p>
            )}
            {/* {leatherPN ? (
              <Barcode
                // value={leatherPN || "N/A"}
                width={1.5}
                height={40}
                fontSize={10}
                margin={0}
              />
            ) : (
              <p>N/A</p>
            )} */}
          </div>
        </div>

        <div
          style={{
            // borderRight: "1px solid #000",
            padding: "10px 5px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Project:
          </div>
          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                fontSize: FONTSIZE.XPRIMARY - 1,
              }}
            >
              {project}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top Section - Pattern Previews */}
        <div
          style={{
            display: "grid",
            padding: "10px",
            gridTemplateColumns: `repeat(${Math.min(data.length, 4)}, 1fr)`,
          }}
        >
          {data?.map((item, index) => (
            <div
              key={index}
              style={{
                // borderRight:
                //   index < Math.min(data.length - 1, 3)
                //     ? "1px solid #000"
                //     : "none",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                minHeight: "200px",
              }}
            >
              {/* Pattern Preview */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  marginBottom: "8px",
                  minHeight: "120px",
                }}
              >
                {item.hpglCode ? (
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      handleModalOpenImage(item?.hpglCode);
                    }}
                  >
                    <HpglViewer hpglCode={item.hpglCode} scale={0.006} />
                  </div>
                ) : (
                  <div
                    style={{ fontSize: FONTSIZE.XPRIMARY - 1, color: "#999" }}
                  >
                    No preview
                  </div>
                )}
              </div>

              {/* Pattern Numbers */}
              <div
                style={{
                  // textAlign: "center",
                  fontSize: FONTSIZE.XPRIMARY - 1,
                  fontWeight: "bold",
                }}
              >
                <div style={{ color: "#e74c3c" }}>
                  {item.pattern_number || ""}
                </div>
                <div
                  style={{
                    fontSize: FONTSIZE.XPRIMARY - 1,
                    fontWeight: "normal",
                  }}
                >
                  <p>{item.pattern || "N/A"}</p>
                  <b>{item.panel_number}</b> ({item.type})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        width="auto"
        height="auto"
        title={
          <div>
            <p style={{ margin: 0 }}>Image pattern</p>
            <p style={{ fontWeight: "lighter", fontSize: "14px" }}>
              {selectedItem?.pattern}
            </p>
            <p style={{ fontWeight: "lighter", fontSize: "14px" }}>
              {selectedItem?.panel_number} ({selectedItem?.type})
            </p>
          </div>
        }
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
            </Select>
          </div>
          <div style={{ paddingTop: "10px" }}></div>
          <HpglViewer scale={scaleValue} hpglCode={patternPNNumberCode} />
        </div>
      </Modal>
    </CardComponent>
  );
};

export default PrintableLabel;
