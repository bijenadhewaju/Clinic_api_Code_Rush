import { useEffect, useState } from "react";
import { getPatients } from "../services/api";
import { useNavigate } from "react-router-dom";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const loadPatients = () => {
    getPatients()
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  useEffect(() => {
    loadPatients();
  }, []);
//logout button
const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
    };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Patient List</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Blood Group</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.username}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.blood_group}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;