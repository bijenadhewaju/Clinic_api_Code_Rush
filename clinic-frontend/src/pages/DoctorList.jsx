import { useEffect, useState } from "react";
import { getDoctors } from "../services/api";
import { useAuth } from "../components/AuthManager";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const { logout } = useAuth();

  const loadDoctors = () => {
    getDoctors()
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Doctor List</h2>
        <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
      </div>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.username}</td>
              <td>{d.specialization}</td>
              <td>{d.experience}</td>
              <td>{d.is_available ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorList;