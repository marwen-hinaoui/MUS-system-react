import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { Progress, Tooltip } from "antd";
import CardComponent from "../card/cardComponent";
import { IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const StatisticsComponent = ({
  icon,
  status,
  total,
  chiffre,
  valuePercent,
}) => {
  const navigate = useNavigate();
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
    <CardComponent width={"25%"} padding={"16px"} hoverable>
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(238, 49, 36, 0.082)`,
            borderRadius: "50%",
            width: 55,
            height: 55,
            color: COLORS.LearRed,
            fontSize: ICONSIZE.PRIMARY,
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: FONTSIZE.XTITLE,
                fontWeight: 700,
                color: COLORS.BLACK,
              }}
            >
              {chiffre}
            </span>
            {status !== "Total" && (
              <span
                style={{
                  color: COLORS.GRAY,
                  fontSize: FONTSIZE.XPRIMARY,
                  fontWeight: 500,
                }}
              >
                /{total}
              </span>
            )}
          </div>
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

        {/* Progress */}
        {status !== "Total" && (
          <Progress
            type="circle"
            percent={valuePercent}
            size={65}
            strokeColor={getProgressColor()}
            strokeWidth={8}
          />
        )}
        {status === "Total" && (
          <Tooltip title="Voir courbes">
            <IoStatsChart
              onClick={() => navigate("/admin/statistics")}
              style={{ cursor: "pointer" }}
              size={ICONSIZE.PRIMARY}
            />
          </Tooltip>
        )}
      </div>
    </CardComponent>
  );
};

export default StatisticsComponent;
