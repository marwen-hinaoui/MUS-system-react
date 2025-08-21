import { Button, Popconfirm } from "antd";
import { COLORS } from "../../constant/colors";
import { MdDelete } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import CardComponent from "../../components/card/cardComponent";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

const DetailsDemande = () => {
  const role = useSelector((state) => state.app.role);
  const { id } = useParams()

  console.log(role);
  console.log(id);

  return (
    <></>
    // row && (
    //   <CardComponent title="Détails demande">
    //     <p>{row.id}</p>
    //     <p>{row.siteNom}</p>
    //     <p>{row.projetNom}</p>
    //     <p>{row.Sequance}</p>
    //     <p>{row.date_creation}</p>
    //     <p>{row.statusDemande}</p>

    //     <div className="d-flex justify-content-end">
    //       <div className="pe-1">
    //         {role === "Admin" && (
    //           <Popconfirm
    //             title="Supprimer"
    //             description="Voulez-vous supprimer cette demande?"
    //             onConfirm={() => alert("deleted")}
    //           >
    //             <Button
    //               style={{
    //                 padding: "10px",
    //                 border: "none",
    //                 background: COLORS.LearRed,
    //                 color: COLORS.WHITE,
    //               }}
    //             >
    //               <MdDelete />
    //             </Button>
    //           </Popconfirm>
    //         )}
    //       </div>

    //       {row.statusDemande === "En cours" &&
    //         (role === "Admin" || role === "AGENT_MUS") && (
    //           /* Backend Check status before change in db */
    //           <Popconfirm
    //             title="Confirmation"
    //             description="Voulez-vous cloturer cette demande?"
    //             onConfirm={() => alert("confirmed")}
    //           >
    //             <Button
    //               style={{
    //                 padding: "10px",
    //                 border: "none",
    //                 background: COLORS.GREEN,
    //                 color: COLORS.WHITE,
    //               }}
    //             >
    //               <AiOutlineCheckCircle />
    //             </Button>
    //           </Popconfirm>
    //         )}
    //     </div>
    //   </CardComponent>
    // )
  );
};

export default DetailsDemande;
