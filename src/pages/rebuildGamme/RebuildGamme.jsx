import { Segmented } from "antd";
import React, { useState } from "react";
import { GammeTaux } from "../../components/gammeTaux/gammeTaux";
import { GammeQte } from "../../components/gammeQte/gammeQte";

const options = ["Gestion Coiffes (Qte)", "Gestion Coiffes (%)"];

const RebuildGamme = () => {
  const [currentView, setCurrentView] = useState("Gestion Coiffes (Qte)");

  return (
    <div className="dashboard">
      <div style={{ paddingBottom: "16px" }}>
        <h4 style={{ margin: "0px" }}>Reconstruction Coiffes</h4>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Segmented
            options={options}
            onChange={(value) => setCurrentView(value)}
            value={currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          />
        </div>

        {currentView === "Gestion Coiffes (Qte)" && (
          <div
            style={{
              paddingTop: "16px",
            }}
          >
            <GammeQte />
          </div>
        )}
        {currentView === "Gestion Coiffes (%)" && (
          <div
            style={{
              paddingTop: "16px",
            }}
          >
            <GammeTaux />
          </div>
        )}
      </div>
    </div>
  );
};
export default RebuildGamme;
