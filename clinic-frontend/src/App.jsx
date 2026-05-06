import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PatientList from "./pages/PatientList";
import HomePage from "./pages/HomePage";
import RegisterPatient from "./pages/RegisterPatient";

import RegisterDoctor from "./pages/RegisterDoctor";
import DoctorList from "./pages/DoctorList";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

import Profile from "./pages/Profile";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div style={{ textAlign: "center" }}>
        <h1>Clinic App</h1>

        <Routes>
          {/*  Pages */}
             <Route path="/register" element={<RegisterPatient />} />
             <Route path="/register_doctor" element={<RegisterDoctor />} />
             <Route path="/login" element={<Login />} />
             <Route path="/patient-list" element={<PatientList />} />
              <Route path="/home-page" element={<HomePage />} />

              <Route path="/register_doctor" element={<RegisterDoctor />} />
             <Route path="/doctor-list" element={<DoctorList />} />

             <Route path="/admin-dashboard" element={<AdminDashboard />} />
             <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
             <Route path="/patient-dashboard" element={<PatientDashboard />} />
             <Route path="/profile" element={<Profile />} />

          {/* Protected Route */}
          <Route
            path="/patient-list"
            element={
              isAuthenticated ? <PatientList /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
               <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
               <Navigate to="/home-page" />
            }
          />
           <Route
            path="register_doctor"
            element={
               <Navigate to="/register_doctor" />
            }
          />
           <Route
            path="doctor-list"
            element={
               <Navigate to="/doctor-list" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;