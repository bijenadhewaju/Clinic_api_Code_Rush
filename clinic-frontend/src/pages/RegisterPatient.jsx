import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../components/AuthManager";

function RegisterPatient() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("other");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    //registration of patient
    axios.post("/api/register/", {
      username,
      password,
      role: "patient",
      age: Number(age),
      gender,
      phone
    })
      .then(() => {
        alert("Registration successful! Please login.");
        navigate("/login/patient");
      })
      .catch((err) => {
        console.log("ERROR:", err.response?.data);
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'object') {
            const errorMessages = Object.entries(err.response.data).map(([field, msg]) => `${field}: ${msg}`).join(', ');
            setError(errorMessages);
          } else {
            setError("Registration failed: " + err.response.data);
          }
        } else {
          setError("Registration failed. Please try again.");
        }
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <h2>Register Patient</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <input
          className="form-control"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="form-control"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <div className="text-start">
          <label className="form-label d-block mb-1 small text-muted">Gender</label>
          <div className="d-flex gap-3">
            {['male', 'female', 'other'].map((g) => (
              <div key={g} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id={`patient-${g}`}
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label text-capitalize" htmlFor={`patient-${g}`}>
                  {g}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="form-label small">Contact</label>
          <input
            className="form-control"
            placeholder="Contact Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg mt-3">Register</button>
      </form>
    </div>
  );
}

export default RegisterPatient;