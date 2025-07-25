import React from "react";
import { FONTSIZE } from "../../constant/FontSizes";

const ClickingIcon = ({ icon, hover, name, color }) => {
  return (
    <div
      className={!hover ? hover : "clickingIcon"}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon}
      <p style={{paddingLeft:'.5px', fontSize:FONTSIZE.PRIMARY, color: color ? color: ""}}>{name ? name : ""}</p>
    </div>
  );
};

export default ClickingIcon;
