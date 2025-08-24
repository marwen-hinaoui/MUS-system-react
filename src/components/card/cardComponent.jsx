import { Card } from "antd";

const CardComponent = ({ children, width, padding, className, margin, height }) => {
  return (
    <Card
      bordered={false}
      variant="borderless"
      className={className}
      style={{
        borderRadius: "5px",
        width: width,
        padding: padding,
        margin: margin,
        height: height,
        boxShadow:
          "0 1px 2px 0 rgba(0, 0, 0, 0.06),0 1px 6px -1px rgba(0, 0, 0, 0.06),0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      {children}
    </Card>
  );
};

export default CardComponent;
