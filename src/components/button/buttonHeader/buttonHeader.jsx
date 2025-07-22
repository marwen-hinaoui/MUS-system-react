import { Link } from "react-router-dom";
import { FONTSIZE } from "../../../constant/FontSizes";
import "./buttonHeader.css";
import { COLORS } from "../../../constant/colors";
const ButtonHeader = ({ content, icon }) => {
  if (!icon) {
    return (
      <div>
        <Link
          style={{ fontSize: FONTSIZE.PRIMARY, color: COLORS.BLACK }}
          className="buttonHeader"
        >
          {content}
        </Link>
      </div>
    );
  } else {
    return (
      <Link
        style={{ fontSize: FONTSIZE.PRIMARY, color: COLORS.BLACK }}
        className="buttonHeader"
      >
        {icon}
        <div className="ps-1">{content}</div>
      </Link>
    );
  }
};

export default ButtonHeader;
