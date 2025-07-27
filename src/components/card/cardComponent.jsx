import { Card } from "antd";

const CardComponent = ({ children, width, padding, className, margin, borderRaduis}) => {
  return (
    <Card variant="borderless" className={className} style={{ borderRadius:borderRaduis, width: width , padding: padding, margin: margin, boxShadow:'0 1px 2px 0 rgba(0, 0, 0, 0.09),0 1px 6px -1px rgba(0, 0, 0, 0.09),0 2px 4px 0 rgba(0, 0, 0, 0.09)'}}>
      {children}
    </Card>
  );
};

export default CardComponent;
