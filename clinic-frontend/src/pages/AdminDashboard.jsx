import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={() => navigate("/doctor-list")}>
        View Doctors
      </button>

      <button onClick={() => navigate("/patient-list")}>
        View Patients
      </button>

      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;