import { BrowserRouter, Route, Routes } from "react-router";
import { LoginProvider } from "../utils/loginProvider";
import Login from "../pages/login/login";
import { ProtectedRoutes } from "../utils/protectedRoutes";
import ChartPage from "../pages/dashboardAdmin/charts/chartPage";
import CreeDemande from "../pages/creeDemande/CreeDemande";
import DetailsDemande from "../pages/detailsDemande/detailsDemandes";
import GestionStock from "../pages/gestionStock/gestionStock";
import GestionUser from "../pages/dashboardAdmin/gestionUser/GestionUser";
import Dashboard from "../pages/dashboardAdmin/dashboard/dashboard";
import RebuildGamme from "../pages/rebuildGamme/RebuildGamme";
import { HpglViewerPage } from "../components/patternViewer/patternViewer";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>404</>} />
          <Route path="/unauthorized" element={<>unauthorized</>} />
          <Route path="testPLT" element={<HpglViewerPage />} />

          <Route path="/user">
            <Route
              index
              element={
                <ProtectedRoutes
                  allowedRoles={[
                    "DEMANDEUR",
                    "AGENT_MUS",
                    "GESTIONNAIRE_STOCK",
                  ]}
                >
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="details/:id"
              element={
                <ProtectedRoutes
                  allowedRoles={[
                    "DEMANDEUR",
                    "AGENT_MUS",
                    "GESTIONNAIRE_STOCK",
                  ]}
                >
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
                <ProtectedRoutes
                  allowedRoles={["AGENT_MUS", "GESTIONNAIRE_STOCK"]}
                >
                  <GestionStock />
                </ProtectedRoutes>
              }
            />
            <Route
              path="reconstitution"
              element={
                <ProtectedRoutes
                  allowedRoles={[
                    "DEMANDEUR",
                    "AGENT_MUS",
                    "GESTIONNAIRE_STOCK",
                  ]}
                >
                  <RebuildGamme />
                </ProtectedRoutes>
              }
            />
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
            <Route
              path="reconstitution"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <RebuildGamme />
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
