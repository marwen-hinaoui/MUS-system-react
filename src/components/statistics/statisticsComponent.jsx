import { useState, useEffect } from "react";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { Progress, Statistic } from "antd";
import CardComponent from "../card/cardComponent";
import { useNavigate } from "react-router-dom";
import "./statisticsComponent.css";

const StatisticsComponent = ({
  icon,
  status,
  total,
  chiffre,
  valuePercent,
}) => {
  const navigate = useNavigate();
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = valuePercent;
    const duration = 800; // ms
    const stepTime = 15; // ms per frame
    const steps = Math.ceil(duration / stepTime);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(
        start + (end - start) * (currentStep / steps),
        end
      );
      setAnimatedPercent(Math.round(progress));
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [valuePercent]);

  const getProgressColor = () => {
    if (status === "Cloturé") {
      if (valuePercent >= 80) return COLORS.GREEN;
      if (valuePercent >= 60) return COLORS.Warning;
      return COLORS.LearRed;
    } else if (status === "En cours" || status === "Hors stock") {
      if (valuePercent <= 20) return COLORS.GREEN;
      if (valuePercent <= 40) return COLORS.Warning;
      return COLORS.LearRed;
    }
    return COLORS.LearRed;
  };

  return (
    // <CardComponent height={"100px"} padding={"0 19px"} width={"25%"} hoverable>
    //   <div
    //     style={{
    //       display: "flex",
    //       alignItems: "center",
    //       gap: 15,
    //       height: "100%",
    //       // position: "absolute",
    //       // top: "50%",
    //       // left: "50%",
    //       // transform: "translate(-50%, -50%)",
    //     }}
    //   >
    //     {/* Icon */}
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         background: `rgba(238, 49, 36, 0.082)`,
    //         borderRadius: "50%",
    //         width: 47,
    //         height: 47,
    //         color: COLORS.LearRed,
    //         fontSize: ICONSIZE.PRIMARY,
    //       }}
    //     >
    //       {icon}
    //     </div>

    //     {/* Text */}
    //     <div style={{ flex: 1 }}>
    //       <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
    //         <span
    //           style={{
    //             fontSize: FONTSIZE.TITLE,
    //             fontWeight: 700,
    //             color: COLORS.BLACK,
    //           }}
    //         >
    //           {chiffre}
    //         </span>
    //         {status !== "Total" && (
    //           <span
    //             style={{
    //               fontSize: FONTSIZE.XPRIMARY,
    //               fontWeight: 500,
    //             }}
    //           >
    //             /{total}
    //           </span>
    //         )}
    //       </div>
    //       <div
    //         style={{
    //           fontSize: FONTSIZE.XPRIMARY + 1,
    //           color: COLORS.BLACK,
    //           marginTop: 4,
    //         }}
    //       >
    //         {status}
    //       </div>
    //     </div>

    //     {/* Progress */}
    //     {status !== "Total" && (
    //       <Progress
    //         type="circle"
    //         percent={animatedPercent}
    //         size={85}
    //         strokeColor={getProgressColor()}
    //         strokeWidth={6}
    //       />
    //     )}
    //     {/* {status === "Total" && (
    //       <Tooltip title="Voir courbes">
    //         <IoStatsChartOutline
    //           onClick={() => navigate("/admin/statistics")}
    //           style={{ cursor: "pointer" }}
    //           size={ICONSIZE.PRIMARY}
    //         />
    //       </Tooltip>
    //     )} */}
    //   </div>
    // </CardComponent>
    <CardComponent width={"25%"} padding={"10px 0"}>
      <div
        style={{
          display: "flex",
          justifyContent: status === "Total" ? "center" : "space-around",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Statistic
            title={<span>{status}</span>}
            value={chiffre}
            valueStyle={{ color: COLORS.BLACK }}
            prefix={icon}
          />
        </div>

        {status !== "Total" && (
          <Progress
            type="circle"
            percent={animatedPercent}
            size={85}
            strokeColor={getProgressColor()}
            strokeWidth={6}
          />
        )}
      </div>
    </CardComponent>
  );
};

export default StatisticsComponent;
