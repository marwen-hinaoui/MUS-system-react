import { ConfigProvider, Spin } from "antd";
import AppRoutes from "./routes/routes";
import "@fontsource/inter";
import { COLORS } from "./constant/colors";
import { useEffect, useState } from "react";
// import 'antd/dist/reset.css';
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setIsLoading(false);
    });
  }, []);
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
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              alignItems: "center",
            }}
          >
            <Spin size="small" />
          </div>
        ) : (
          <AppRoutes />
        )}
      </ConfigProvider>
    </>
  );
};

export default App;
