import { BrowserRouter, Route, Routes } from "react-router";

import { LoginProvider } from "../utils/loginProvider";
import Login from "../pages/login/login";
import Dashboard from "../pages/dashboard/dashboard";
import { ProtectedRoutes } from "../utils/protectedRoutes";
const MUSRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/*Login Route*/}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>404</>} />

          {/*Dashboard Route*/}
          <Route path="/dashboard">
            <Route
              index
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            {/* <Route
              path="/demande"
              element={
                <ProtectedRoutes>
                  <Demande />
                </ProtectedRoutes>
              }
            /> */}
          </Route>
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
};

export default MUSRoutes;
