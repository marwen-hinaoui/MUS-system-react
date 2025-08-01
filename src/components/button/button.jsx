import { Button, Spin } from "antd";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";

const SharedButton = ({
  name,
  loading,
  width,
  margins,
  color,

  padding,
  colorText,
  callBack,
}) => {
  const styles = {
    padding: !padding ? "20px" : padding,
    width: width,
    fontSize: FONTSIZE.PRIMARY -1,
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
        <p className="d-flex align-items-center">

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
        onClick={callBack}
      >
        <p className="d-flex align-items-center">
          
          {name}
        </p>
      </Button>
    );
  }
};

export default SharedButton;
