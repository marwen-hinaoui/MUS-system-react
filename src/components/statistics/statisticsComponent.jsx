import CardComponent from "../card/cardComponent";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";

const StatisticsComponent = ({
  icon,
  title,
  valuePercent,
  chiffre,
  backgroundColor,
}) => {
  return (
    <div
      style={{
        borderRadius: 8,
        width: "25%",
      }}
    >
      <CardComponent padding={"10px 13px"}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: backgroundColor,
            borderRadius: "50%",
            margin: "0",
            padding: "0",
            width: 50,
            height: 50,
            color: COLORS.WHITE,
            fontSize: ICONSIZE.PRIMARY,
          }}
        >
          {icon}
        </div>
        <div style={{ float: "right" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: FONTSIZE.XTITLE,
                fontWeight: 600,
                color: "#000",
                marginRight: 8,
              }}
            >
              {chiffre}
            </div>

            <div
              style={{
                color: "green",
                fontSize: FONTSIZE.SMALL,
              }}
            >
              {valuePercent !== undefined && valuePercent}%
            </div>
          </div>
          {/* Title */}
          <div
            style={{
              color: "#999",
              fontSize: FONTSIZE.XPRIMARY,
            }}
          >
            {title}
          </div>
        </div>
      </CardComponent>
    </div>
  );
};

export default StatisticsComponent;
