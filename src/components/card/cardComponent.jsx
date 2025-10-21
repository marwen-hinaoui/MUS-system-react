import { Card } from "antd";

const CardComponent = ({
  children,
  width,
  padding,
  className,
  margin,
  height,
  cursor,
  callback,
}) => {
  return (
    <Card
      bordered={false}
      onClick={callback}
      variant="borderless"
      className={className}
      style={{
        cursor: cursor && "pointer",
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
