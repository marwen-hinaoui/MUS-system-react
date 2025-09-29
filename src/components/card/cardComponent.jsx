import { Card } from "antd";

const CardComponent = ({
  children,
  width,
  padding,
  className,
  margin,
  height,
}) => {
  return (
    <Card
      bordered={false}
      variant="borderless"
      className={className}
      style={{
        borderRadius: "4px",
        width: width,
        padding: padding,
        margin: margin,
        height: height,
      }}
    >
      {children}
    </Card>
  );
};

export default CardComponent;
