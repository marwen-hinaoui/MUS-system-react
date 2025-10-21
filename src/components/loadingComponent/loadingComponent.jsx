import { Spin } from "antd/lib";

const LoadingComponent = ({ header, height }) => {
  if (!height) {
    return (
      <div
        style={{
          width: "100%",
          height: header ? "calc( 100vh - 63px )" : "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="small" />
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="small" />
      </div>
    );
  }
};

export default LoadingComponent;
