import { Card, Progress } from "antd";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import "./statisticsComponent.css";


const StatisticsComponent = ({
  icon,
  title,
  valuePercent,
  chiffre,
  borderColor = "#1890ff",
  tooltip,
  subtitle,
}) => {
  return (
    <Card
      className="cardStatistic enhanced-statistics-card"
      bordered={false}
      style={{
        borderBottom: `4px solid ${borderColor}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 12,
      }}
    >
      <div className="stat-header d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <span
            className="me-2"
            style={{
              fontSize: ICONSIZE.PRIMARY,
              // color: borderColor,
            }}
          >
            {icon}
          </span>
          <div>
            <div
              style={{
                fontSize: FONTSIZE.TITLE,
                fontWeight: 600,
              }}
            >
              {title}

            </div>
            {subtitle && (
              <div style={{ fontSize: FONTSIZE.TEXT, color: "#666" }}>{subtitle}</div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center flex-column">
        {valuePercent !== undefined ? (
          <>
            <Progress
              type="circle"
              percent={valuePercent}
              strokeColor={borderColor}
              size={100}
            />
            <div
              style={{
                marginTop: 10,
                fontSize: FONTSIZE.TITLE + 5,
                fontWeight: 500,
              }}
            >
              {chiffre} / 10
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: FONTSIZE.TITLE + 10,
              fontWeight: 600,
              color: borderColor,
            }}
          >
            {chiffre} / 10
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatisticsComponent;
