import { Drawer, Modal, Tooltip } from "antd";
import { IoCheckmarkCircle } from "react-icons/io5";
import { COLORS } from "../../constant/colors";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import ClickingIcon from "../clickingIcon/clickingIcon";
import SharedButton from "../button/button";
import { AiFillCloseCircle } from "react-icons/ai";

const DrawerComponent = ({ open, row, handleCloseDrawer, role }) => {
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  return (
    row && (
      <Drawer
        title="Détails demande"
        placement="right"
        closable={true}
        onClose={handleCloseDrawer}
        open={open}
      >
        <p>{row.id}</p>
        <p>{row.site}</p>
        <p>{row.projet}</p>
        <p>{row.sequance}</p>
        <p>{row.date_creation}</p>
        <p>{row.status}</p>

        <div className="d-flex justify-content-end">
          <div>
            {row.status == "En cours" && (
              /* Backend Check status before change in db */
              <div
                className="icon-wrapper pe-2"
                onClick={() => setVisible(true)}
              >
                <SharedButton
                  padding={"8px"}
                  color={COLORS.GREEN}
                  name={"Cloturé"}
                />
              </div>
            )}
          </div>
          {role == "Admin" && (
            <div onClick={() => setVisibleDelete(true)}>
              <SharedButton
                padding={"10px"}
                color={COLORS.LearRed}
                name={"Supprimer"}
              />
            </div>
          )}
        </div>
        {/* Terminer Modal  */}

        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IoCheckmarkCircle
                size={ICONSIZE.PRIMARY}
                style={{ color: COLORS.GREEN }}
              />
              <span style={{ fontSize: FONTSIZE.TITLE }}>Confirmation</span>
            </div>
          }
          onCancel={() => setVisible(false)}
          open={visible}
          footer={[
            <div className="d-flex justify-content-end">
              <div className="pe-3" onClick={() => setVisible(false)}>
                <SharedButton
                  color={COLORS.WHITE}
                  colorText={COLORS.BLACK}
                  padding={"10px"}
                  name={"Non"}
                />
              </div>
              <div onClick={() => alert("Cloturé")}>
                <SharedButton
                  padding={"10px"}
                  color={COLORS.Blue}
                  name={"Oui"}
                />
              </div>
            </div>,
          ]}
        >
          <p style={{ fontSize: FONTSIZE.PRIMARY }}>
            Voulez-vous cloturer cette demande?
          </p>
        </Modal>

        {/* Delete Modal  */}
        {role == "Admin" && (
          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AiFillCloseCircle
                  size={ICONSIZE.PRIMARY}
                  style={{ color: COLORS.LearRed }}
                />
                <span style={{ fontSize: FONTSIZE.TITLE }}>Supprimer</span>
              </div>
            }
            open={visibleDelete}
            onCancel={() => setVisibleDelete(false)}
            okText="Oui"
            cancelText="Non"
            footer={[
              <div className="d-flex justify-content-end">
                <div className="pe-3" onClick={() => setVisibleDelete(false)}>
                  <SharedButton
                    color={COLORS.WHITE}
                    colorText={COLORS.BLACK}
                    padding={"10px"}
                    name={"Non"}
                  />
                </div>
                <div onClick={() => alert("Supprimé")}>
                  <SharedButton
                    padding={"10px"}
                    color={COLORS.Blue}
                    name={"Oui"}
                  />
                </div>
              </div>,
            ]}
          >
            <p style={{ fontSize: FONTSIZE.PRIMARY }}>
              Voulez-vous supprimer cette demande?
            </p>
          </Modal>
        )}
      </Drawer>
    )
  );
};

export default DrawerComponent;
