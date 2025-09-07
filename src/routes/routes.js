import { BrowserRouter, Route, Routes } from "react-router";
import { LoginProvider } from "../utils/loginProvider";
import Login from "../pages/login/login";
import { ProtectedRoutes } from "../utils/protectedRoutes";
import Profil from "../pages/profil/profil";
import ChartPage from "../pages/dashboardAdmin/charts/chartPage";
import CreeDemande from "../pages/creeDemande/CreeDemande";
import DetailsDemande from "../pages/detailsDemande/detailsDemandes";
import GestionStock from "../pages/gestionStock/gestionStock";
import GestionUser from "../pages/dashboardAdmin/gestionUser/GestionUser";
import Dashboard from "../pages/dashboardAdmin/dashboard/dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>404</>} />
          <Route path="/unauthorized" element={<>unauthorized</>} />

          {/* User Dashboard (Demandeur + Agent) */}
          <Route path="/user">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR", "AGENT_MUS"]}>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="details/:id"
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR", "AGENT_MUS"]}>
                  <DetailsDemande />
                </ProtectedRoutes>
              }
            />
            <Route
              path="cree_demande"
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR"]}>
                  <CreeDemande />
                </ProtectedRoutes>
              }
            />
            <Route
              path="stock"
              element={
                <ProtectedRoutes allowedRoles={["AGENT_MUS"]}>
                  <GestionStock />
                </ProtectedRoutes>
              }
            />
            {/* <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR", "AGENT_MUS"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            /> */}
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="details/:id"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <DetailsDemande />
                </ProtectedRoutes>
              }
            />
            <Route
              path="cree_demande"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <CreeDemande />
                </ProtectedRoutes>
              }
            />
            <Route
              path="stock"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <GestionStock />
                </ProtectedRoutes>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <GestionUser />
                </ProtectedRoutes>
              }
            />
            {/* <Route
              path="statistics"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <ChartPage />
                </ProtectedRoutes>
              }
            /> */}
            {/* <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            /> */}
          </Route>
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
