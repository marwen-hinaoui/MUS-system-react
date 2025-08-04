import { Card } from "antd";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";

const StatisticsComponent = ({
  icon,
  title,
  valuePercent,
  chiffre,
  borderColor = "#1890ff",
}) => {
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        padding: 55,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",

        height: 160,
      }}
    >
      {/* Icon in colored circle */}
      <div
        style={{
          backgroundColor: borderColor,
          borderRadius: "50%",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ color: "white", fontSize: ICONSIZE.MAIN || 24 }}>
          {icon}
        </div>
      </div>

      {/* Value and percentage */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <div
          style={{
            fontSize: FONTSIZE.TITLE + 6,
            fontWeight: 600,
            color: "#000",
            marginRight: 8,
          }}
        >
          {chiffre}
        </div>
        {valuePercent !== undefined && (
          <div style={{ color: "green", fontSize: FONTSIZE.TEXT }}>
            +{valuePercent}%
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ color: "#999", fontSize: FONTSIZE.TEXT }}>{title}</div>
    </Card>
  );
};

export default StatisticsComponent;
