import { useState, useEffect } from "react";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { Card, Progress } from "antd";
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
    if (status === "Préparation en cours" || status === "Demande livrée") {
      if (valuePercent >= 80) return COLORS.GREEN;
      if (valuePercent >= 60) return COLORS.Warning;
      return COLORS.LearRed;
    } else if (status === "Hors stock") {
      if (valuePercent <= 20) return COLORS.GREEN;
      if (valuePercent <= 40) return COLORS.Warning;
      return COLORS.LearRed;
    }
    return COLORS.LearRed;
  };

  return (
    <CardComponent
      // style={{
      //   borderRadius: "4px",
      //   height: "100px",
      //   padding: "12px",
      //   width: "25%",
      // }}
      height={"100px"}
      padding={"12px"}
      width={"25%"}
      hoverable
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          height: "100%",
          // position: "absolute",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
        }}
      >
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ gap: 4 }}>
            <span
              style={{
                fontSize: FONTSIZE.TITLE,
                fontWeight: 700,
                color: COLORS.BLACK,
              }}
            >
              {chiffre}
            </span>
            {status !== "Total" && (
              <span
                style={{
                  fontSize: FONTSIZE.XPRIMARY,
                  fontWeight: 500,
                }}
              >
                /{total}
              </span>
            )}
            <div
              style={{
                fontSize: FONTSIZE.XPRIMARY,
                color: COLORS.Gray3,
                marginTop: 4,
              }}
            >
              {status}
            </div>
          </div>
        </div>

        {/* Progress */}
        {status !== "Total" && (
          <Progress
            type="circle"
            percent={animatedPercent}
            size={85}
            strokeColor={getProgressColor()}
            strokeWidth={7}
            format={(percent) => (
              <span style={{ color: COLORS.BLACK }}>{percent}%</span>
            )}
          />
        )}
        {/* {status === "Total" && (
          <Tooltip title="Voir courbes">
            <IoStatsChartOutline
              onClick={() => navigate("/admin/statistics")}
              style={{ cursor: "pointer" }}
              size={ICONSIZE.PRIMARY}
            />
          </Tooltip>
        )} */}
      </div>
    </CardComponent>
  );
};

export default StatisticsComponent;
