import { BrowserRouter, Route, Routes } from "react-router";

import { LoginProvider } from "../utils/loginProvider";
import Login from "../pages/login/login";
import { ProtectedRoutes } from "../utils/protectedRoutes";
import Profil from "../pages/profil/profil";
import DashboardDemandeur from "../pages/dashboardDemandeur/dashboard/dashboard";
import DashboardAgentStock from "../pages/dashboardAgentStock/dashboard/dashboard";
import DashboardAdmin from "../pages/dashboardAdmin/dashboard/dashboard";
const MUSRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/*Login Route*/}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>404</>} />
          <Route path="/unauthorized" element={<>unauthorized</>} />

          {/*Dashboard Demandeur Route*/}
          <Route path="/demandeur">
            <Route
              index
              element={
                <ProtectedRoutes  allowedRoles={["ROLE_DEMANDEUR"]}>
                  <DashboardDemandeur />
                </ProtectedRoutes>
              }
            />
            <Route
              path="cree_demande"
              element={
                <ProtectedRoutes  allowedRoles={["ROLE_DEMANDEUR"]}>
                  <>cree_demande demandeur</>
                </ProtectedRoutes>
              }
            />
            <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["ROLE_DEMANDEUR"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            />
          </Route>

          
          {/*Dashboard Demandeur agent*/}
          <Route path="/agent">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["ROLE_AGENT_MUS"]}>
                  <DashboardAgentStock />
                </ProtectedRoutes>
              }
            />
            <Route
              path="stock"
              element={
                <ProtectedRoutes allowedRoles={["ROLE_AGENT_MUS"]}>
                  <>stock</>
                </ProtectedRoutes>
              }
            />
            <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["ROLE_AGENT_MUS"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            />
          </Route>

          




          {/*Dashboard Demandeur admin*/}
          <Route path="/admin" >
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <DashboardAdmin />
                </ProtectedRoutes>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <>Gestion user</>
                </ProtectedRoutes>
              }
            />
            <Route
              path="cree_demande"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <>cree_demande</>
                </ProtectedRoutes>
              }
            />
            <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            />
          </Route>
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
};

export default MUSRoutes;
