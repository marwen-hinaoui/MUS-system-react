import { ConfigProvider } from "antd";
import AppRoutes from "./routes/routes";
import "@fontsource/inter";
import { COLORS } from "./constant/colors";
const App = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            // Segmented: {
            //   itemSelectedBg: COLORS.LearRed,
            //   itemSelectedColor: COLORS.WHITE,
            // },
            Typography: {
              linkDecoration: "underline",
              linkHoverColor: "inherit",
            },
            Table: {
              borderRadius: "4px",
              headerBorderRadius: "4px",
              cellBorderRadius: 0,
              headerColor: COLORS.BLACK,
            },
          },
          token: {
            // motion: false,
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
