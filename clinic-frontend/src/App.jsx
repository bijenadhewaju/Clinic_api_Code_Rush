import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthManager";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import PatientList from "./pages/PatientList";
import HomePage from "./pages/HomePage";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";
import DoctorList from "./pages/DoctorList";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Profile from "./pages/Profile";
import BookAppointment from "./components/appointments/BookAppointment";
import MedicalHistory from "./pages/MedicalHistory";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ textAlign: "center" }}>
          <h1>Clinic App</h1>

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/doctor" element={<Login expectedRole="doctor" />} />
            <Route path="/login/patient" element={<Login expectedRole="patient" />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/register-patient" element={<RegisterPatient />} />
            <Route path="/register-doctor" element={<RegisterDoctor />} />

            {/* Protected Admin Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DoctorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PatientList />
                </ProtectedRoute>
              }
            />

            {/* Protected Doctor Routes */}
            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Patient Routes */}
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
                path="/dashboard/patient/medical-history"
                element={
                    <ProtectedRoute allowedRoles={['patient']}>
                        <MedicalHistory />
                        </ProtectedRoute>
                }
            />

            {/* Other routes that might exist and require some protection or redirect */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;