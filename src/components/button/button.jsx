import { Button, Spin } from "antd";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";

const SharedButton = ({ name, loading, width, margins, color }) => {
  const styles = {
    padding: "20px",
    width: width,
    fontSize: FONTSIZE.PRIMARY,
    backgroundColor: color,
    color: COLORS.WHITE,
    border: "none",
  };
  if (loading) {
    return (
      <Button
        htmlType="submit" 
        style={styles}
        color={color ? "" : "primary"}
        variant="solid"
        className={margins}
      >
        {name}
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
        {name}
      </Button>
    );
  }
};

export default SharedButton;
