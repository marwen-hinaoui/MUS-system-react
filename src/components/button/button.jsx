import { Button } from "antd";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import CardComponent from "../card/cardComponent";

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
  // if (loading) {
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
        {/* <span
            style={{
              paddingLeft: "5px",
            }}
          ></span>*/}
        {name && name}
      </span>
    </Button>
  );
  // }
  // else {
  //   return (
  //     <Button
  //       htmlType="submit"
  //       style={styles}
  //       variant="solid"
  //       className={margins}
  //       onClick={callBack}
  //       disabled={disabled}
  //       loading={loading}
  //     >
  //       <p className="d-flex align-items-center">
  //         {icon && icon}
  //         {/* <span
  //           style={{
  //             paddingLeft: "5px",
  //           }}
  //         ></span> */}
  //         {name && name}
  //       </p>
  //     </Button>
  //   );
  // }
};

export default SharedButton;
