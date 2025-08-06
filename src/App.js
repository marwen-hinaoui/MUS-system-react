import LoadingBar from "react-top-loading-bar";
import AppRoutes from "./routes/routes";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { COLORS } from "./constant/colors";

const App = () => {
  const loading = useSelector((state) => state.app.loading);
  const loadingRef = useRef(null);
  useEffect(() => {
    if (loading) {
      loadingRef.current?.start();
    } else {
      loadingRef.current?.complete();
    }
  }, [loading]);
  return (
    <>
      <LoadingBar color={COLORS.LearRed} height={2} ref={loadingRef} />
      <AppRoutes />
    </>
  );
};

export default App;
