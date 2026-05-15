import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthManager";

function RegisterDoctor() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [gender, setGender] = useState("other");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      //  1. REGISTER DOCTOR
      await axios.post("/api/register/", {
        username,
        password,
        role: "doctor",
        specialization,
        experience: String(experience),
        gender,
        phone,
      });

      //  2. AUTO LOGIN
      const res = await axios.post("/api/token/", {
        username,
        password,
      });

      //  3. SAVE TOKEN
      const token = res.data.access;
      localStorage.setItem("token", token);

      //  4. REDIRECT VIA CONTEXT
      login(token, "doctor");

    } catch (err) {
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
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <h2 className="text-center mb-4">Register Doctor</h2>

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
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
        <input
          className="form-control"
          placeholder="Experience (e.g. '5 years')"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <div className="mb-2">
          <label className="form-label d-block mb-1 small text-muted">Gender</label>
          <div className="d-flex gap-3">
            {['male', 'female', 'other'].map((g) => (
              <div key={g} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id={`doctor-${g}`}
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label text-capitalize" htmlFor={`doctor-${g}`}>
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

export default RegisterDoctor;