import { Button } from "antd";
import { COLORS } from "../../constant/colors";

const SharedButton = ({
  name,
  loading,
  width,
  margins,
  color,
  icon,
  padding,
  colorText,
  callBack,
  disabled,
  fontSize,
}) => {
  const styles = {
    padding: padding && padding,
    width: width,
    fontSize: fontSize && fontSize,
    backgroundColor: color ? color : "none",
    color: !colorText ? COLORS.WHITE : colorText,
    border: "none",
    borderRadius: "5px",
  };

  return (
    <Button
      htmlType="submit"
      style={styles}
      variant="solid"
      className={margins}
      onClick={callBack}
      disabled={disabled}
      loading={loading}
    >
      <span className="d-flex align-items-center">
        {icon && icon}

        {name && name}
      </span>
    </Button>
  );
};

export default SharedButton;
