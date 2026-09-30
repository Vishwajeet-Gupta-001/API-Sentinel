import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import CreateMonitor from "./pages/CreateMonitor";
import MonitorDetails from "./pages/MonitorDetails";
import EditMonitor from "./pages/EditMonitor";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-monitor"
            element={
              <ProtectedRoute>
                <CreateMonitor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/monitors/:monitorId"
            element={
              <ProtectedRoute>
                <MonitorDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/monitors/:monitorId/edit"
            element={
              <ProtectedRoute>
                <EditMonitor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents"
            element={
              <ProtectedRoute>
                <Incidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents/:incidentId"
            element={
              <ProtectedRoute>
                <IncidentDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
