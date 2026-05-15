import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthManager";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      <div className="d-flex gap-2 justify-content-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/doctors")}>
          View Doctors
        </button>

        <button className="btn btn-primary" onClick={() => navigate("/patients")}>
          View Patients
        </button>

        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;