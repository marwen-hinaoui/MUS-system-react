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
import BinsPage from "../pages/bins/BinsPage";
import GammeMUS from "../pages/gammeMUS/gammeMUS";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100vh",
                  alignItems: "center",
                }}
              >
                <h1>404</h1>
              </div>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100vh",
                  alignItems: "center",
                }}
              >
                <h1>Unauthorized 403</h1>
              </div>
            }
          />

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
              path="gamme"
              element={
                <ProtectedRoutes
                  allowedRoles={[
                    "DEMANDEUR",
                    "AGENT_MUS",
                    "GESTIONNAIRE_STOCK",
                  ]}
                >
                  <GammeMUS />
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
              path="gamme"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <GammeMUS />
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
            <Route
              path="bins"
              element={
                <ProtectedRoutes allowedRoles={["Admin"]}>
                  <BinsPage />
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
