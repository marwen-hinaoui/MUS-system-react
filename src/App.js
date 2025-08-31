import { ConfigProvider } from "antd";
import AppRoutes from "./routes/routes";
import "@fontsource/inter";
const App = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Inter, sans-serif",
            colorPrimary: "#EE3124",
            colorInfo: "#EE3124",
            colorError: "#EE3124",
            colorLink: "#EE3124",
          },
        }}
      >
        <AppRoutes />
      </ConfigProvider>
    </>
  );
};

export default App;
