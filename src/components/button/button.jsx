import { Button, Spin } from "antd";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";

const SharedButton = ({ name, loading, width, margins, color }) => {
  if (loading) {
    return (
      <Button
        style={{
          padding: "20px",
          width: width,
          fontSize: FONTSIZE.PRIMARY,
          backgroundColor: color,
          color: COLORS.WHITE,
        }}
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
        style={{
          padding: "20px",
          width: width,
          fontSize: FONTSIZE.PRIMARY,
          backgroundColor: color,
          color: COLORS.WHITE,
        }}
        color={color ? "" : "primary"}
        variant="solid"
        className={margins}
      >
        {name}
      </Button>
    );
  }
};

export default SharedButton;
