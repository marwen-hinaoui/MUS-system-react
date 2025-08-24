import { Button, Drawer, Popconfirm } from "antd";
import { COLORS } from "../../constant/colors";
import { MdDelete } from "react-icons/md";
import { RxCheckCircled } from "react-icons/rx";

const DrawerComponent = ({ open, row, handleCloseDrawer, role }) => {
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
        <p>{row.siteNom}</p>
        <p>{row.projetNom}</p>
        <p>{row.Sequance}</p>
        <p>{row.date_creation}</p>
        <p>{row.statusDemande}</p>

        <div className="d-flex justify-content-end">
          <div className="pe-1">
            {role === "Admin" && (
              <Popconfirm
                title="Supprimer"
                description="Voulez-vous supprimer cette demande?"
                onConfirm={() => alert("deleted")}
              >
                <Button
                  style={{
                    padding: "10px",
                    border: "none",
                    background: COLORS.LearRed,
                    color: COLORS.WHITE,
                  }}
                >
                  <MdDelete />
                </Button>
              </Popconfirm>
            )}
          </div>

          {row.statusDemande === "En cours" &&
            (role === "Admin" || role === "AGENT_MUS") && (
              /* Backend Check status before change in db */
              <Popconfirm
                title="Confirmation"
                description="Voulez-vous cloturer cette demande?"
                onConfirm={() => alert("confirmed")}
              >
                <Button
                  style={{
                    padding: "10px",
                    border: "none",
                    background: COLORS.GREEN,
                    color: COLORS.WHITE,
                  }}
                >
                  <RxCheckCircled />
                </Button>
              </Popconfirm>
            )}
        </div>
      </Drawer>
    )
  );
};

export default DrawerComponent;
