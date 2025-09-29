import { Button, Result } from "antd";
import React from "react";
import { GrVmMaintenance } from "react-icons/gr";
import { ICONSIZE } from "../../constant/FontSizes";

const RebuildGamme = () => {
  return (
    <div className="dashboard">
      <div style={{ paddingBottom: "16px" }}>
        <h4 style={{ margin: "0px" }}>Reconstruction Coif</h4>
        <Result title="En cours de dévelopement" icon={<GrVmMaintenance  size={ICONSIZE.XLARGE +10} />} />
      </div>
    </div>
  );
};
export default RebuildGamme;
