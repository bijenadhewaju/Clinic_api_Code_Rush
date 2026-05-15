import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import AppointmentTable from "../components/appointments/AppointmentTable";
import { useAuth } from "../components/AuthManager";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchProfile = () => {
    API.get("profile/")
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  };

  const fetchAppointments = () => {
    API.get("clinic/appointment/")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log(err));
  };

  const handleUpdate = (id, data) => {
    API.patch(`clinic/appointment/${id}/`, data)
      .then(() => {
        fetchAppointments();
      })
      .catch(err => console.error("Update failed", err));
  };

  const handleCancel = (id) => {
    API.patch(`clinic/appointment/${id}/`, { status: 'cancelled' })
      .then(() => {
        fetchAppointments();
      })
      .catch(err => console.error("Cancel failed", err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="mb-0">Patient Dashboard</h2>
          {profile && <p className="text-muted mb-0">Welcome back, {profile.username}!</p>}
        </div>
        <div className="d-flex gap-2">
          <Link to="/book-appointment" className="btn btn-primary">Book Appointment</Link>
          <button onClick={logout} className="btn btn-outline-danger">Logout</button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body py-3">
              <h5 className="card-title"><i className="bi bi-person-circle me-2"></i>My Profile</h5>
              <Link to="/profile" className="text-decoration-none">Edit Profile Detail &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Appointment History</h4>
      <AppointmentTable
        appointments={appointments}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        role="patient"
      />
    </div>
  );
}

export default PatientDashboard;