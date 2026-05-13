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
    <div>
      <h2>Patient List</h2>
<button onClick={handleLogout}>Logout</button>
      {patients.map((p) => (
        <div key={p.id}>
          <p>Name:{p.username}</p>
            <p>Age:{p.age}</p>
            <p>Gender:{p.gender}</p>
            <p>Height:{p.height}, Weight:{p.weight}</p>
            <p>Phone:{p.phone}</p>
            <p>Address:{p.address}</p>
            <p>Blood Group:{p.blood_group}</p>
            <p>Medical Condition:{p.medical_conditions}</p>
            <p>Emergency Contact:{p.emergency_contact}</p>
        </div>
      ))}
    </div>
  );
}

export default PatientList;