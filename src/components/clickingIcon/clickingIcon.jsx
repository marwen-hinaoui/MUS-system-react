import React from "react";
import { FONTSIZE } from "../../constant/FontSizes";
import { Button } from "antd";

const ClickingIcon = ({ icon, hover, name, color, background, isLoading }) => {
  return (
    <Button
      loading={isLoading}
      className={!hover ? hover : "clickingIcon"}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        background: background ? background : "none",
        border: "none",
        boxShadow: "none",
        padding: 0,
        gap: "0",
      }}
    >
      {!isLoading && icon}
      <p
        style={{
          fontSize: FONTSIZE.PRIMARY,
          color: color ? color : "",
        }}
      >
        {name ? name : ""}
      </p>
    </Button>
  );
};

export default ClickingIcon;
