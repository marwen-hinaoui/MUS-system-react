import { Button } from "antd";
import { FONTSIZE } from "../../constant/FontSizes";
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
}) => {
  const styles = {
    padding: !padding ? "20px" : padding,
    width: width,
    fontSize: FONTSIZE.PRIMARY,
    backgroundColor: color ? color : "none",
    color: !colorText ? COLORS.WHITE : colorText,
    border: "none",
    borderRadius: "5px",
  };
  if (loading) {
    return (
      <Button
        htmlType="submit"
        style={styles}
        variant="solid"
        className={margins}
        onClick={callBack}
        disabled={disabled}
      >
        <span className="d-flex align-items-center">
          {icon && icon}
          <span
            style={{
              paddingLeft: "5px",
            }}
          ></span>
          {name && name}
        </span>
      </Button>
    );
  } else {
    return (
      <Button
        htmlType="submit"
        style={styles}
        variant="solid"
        className={margins}
        onClick={callBack}
        disabled={disabled}
      >
        <p className="d-flex align-items-center">
          {icon && icon}
          <span
            style={{
              paddingLeft: "5px",
            }}
          ></span>
          {name && name}
        </p>
      </Button>
    );
  }
};

export default SharedButton;
