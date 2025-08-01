import React from "react";
import { FONTSIZE } from "../../constant/FontSizes";

const ClickingIcon = ({ icon, hover, name, color, background }) => {
  return (
    <div
      className={!hover ? hover : "clickingIcon"}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        background:background ? background : "none",
        borderRadius:'8px'
      }}
    >
      {icon}
      <p style={{paddingLeft:'.5px', fontSize:FONTSIZE.PRIMARY, color: color ? color: ""}}>{name ? name : ""}</p>
    </div>
  );
};

export default ClickingIcon;
