import { BrowserRouter, Route, Routes } from "react-router";
import { LoginProvider } from "../utils/loginProvider";
import Login from "../pages/login/login";
import { ProtectedRoutes } from "../utils/protectedRoutes";
import Profil from "../pages/profil/profil";
import DashboardDemandeur from "../pages/dashboardDemandeur/dashboard/dashboard";
import DashboardAgentStock from "../pages/dashboardAgentStock/dashboard/dashboard";
import DashboardAdmin from "../pages/dashboardAdmin/dashboard/dashboard";
import ChartPage from "../pages/dashboardAdmin/charts/chartPage";
import CreeDemande from "../pages/creeDemande/CreeDemande";
import DetailsDemande from "../pages/detailsDemande/detailsDemandes";
import GestionStock from "../pages/gestionStock/gestionStock";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>404</>} />
          <Route path="/unauthorized" element={<>unauthorized</>} />

          {/* Shared routes */}

          {/* Demandeur dashboard */}
          <Route path="/demandeur">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR"]}>
                  <DashboardDemandeur />
                </ProtectedRoutes>
              }
            />
            <Route
              path="details/:id"
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR"]}>
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
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["DEMANDEUR"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            />
          </Route>

          {/* Agent dashboard */}
          <Route path="/agent">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["AGENT_MUS"]}>
                  <DashboardAgentStock />
                </ProtectedRoutes>
              }
            />
            <Route
              path="details/:id"
              element={
                <ProtectedRoutes allowedRoles={["AGENT_MUS"]}>
                  <DetailsDemande />
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
            <Route
              path="profil"
              element={
                <ProtectedRoutes allowedRoles={["AGENT_MUS"]}>
                  <Profil />
                </ProtectedRoutes>
              }
            />
          </Route>

          {/* Admin dashboard */}
          <Route path="/Admin">
            <Route
              index
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <DashboardAdmin />
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
                  <>Gestion user</>
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
            <Route
              path="statistics"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <ChartPage />
                </ProtectedRoutes>
              }
            />
          </Route>
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
