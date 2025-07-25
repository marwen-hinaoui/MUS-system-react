import { Button, Spin } from "antd";
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
      >
        <p>
          {icon ? icon : ""}
          {name}
        </p>
        <Spin size="small" />
      </Button>
    );
  } else {
    return (
      <Button
        htmlType="submit"
        style={styles}
        variant="solid"
        className={margins}
      >
        <p>
          {icon ? icon : ""}
          {name}
        </p>
      </Button>
    );
  }
};

export default SharedButton;
