import { useEffect, useState } from "react";
import API from "../services/api";
import AppointmentTable from "../components/appointments/AppointmentTable";
import { useAuth } from "../components/AuthManager";
import { Link } from "react-router-dom";

function DoctorDashboard() {
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

  const handleUpdateStatus = (id, status) => {
    API.patch(`clinic/appointment/${id}/`, { status })
      .then(() => {
        fetchAppointments();
      })
      .catch(err => console.error("Update status failed", err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="mb-0">Doctor Dashboard</h2>
          {profile && <p className="text-muted mb-0">Dr. {profile.username}, welcome to your workspace.</p>}
        </div>
        <button onClick={logout} className="btn btn-outline-danger">Logout</button>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body py-3">
              <h5 className="card-title"><i className="bi bi-person-badge me-2"></i>Professional Profile</h5>
                <Link to="/profile" className="text-decoration-none">Update Clinic Details &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Assigned Appointments</h4>
      <AppointmentTable
        appointments={appointments}
        onUpdateStatus={handleUpdateStatus}
        role="doctor"
      />
    </div>
  );
}

export default DoctorDashboard;