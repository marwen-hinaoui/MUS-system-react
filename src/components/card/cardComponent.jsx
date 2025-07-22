import { Card } from "antd";

const CardComponent = ({ children, width, padding, className, margin  }) => {
  return (
    <Card variant="borderless" className={className} style={{ width: width , padding: padding, margin: margin}}>
      {children}
    </Card>
  );
};

export default CardComponent;
