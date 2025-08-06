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
}) => {
  const styles = {
    padding: !padding ? "20px" : padding,
    width: width,
    fontSize: FONTSIZE.PRIMARY,
    backgroundColor: color ? color : "none",
    color: !colorText ? COLORS.WHITE : colorText,
    border: "none",
  };
  if (loading) {
    return (
      <Button
        htmlType="submit"
        style={styles}
        variant="solid"
        className={margins}
        onClick={callBack}

      >
        <span className="d-flex align-items-center">
          {icon && icon} {name && name}
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
      >
        <p className="d-flex align-items-center">
          {icon && icon} {name && name}
        </p>
      </Button>
    );
  }
};

export default SharedButton;
