import { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthManager";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({ expectedRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // If no role selected yet, show choice screen
  if (!expectedRole) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
        <h2>Login As</h2>
        <div className="d-flex flex-column gap-3 mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login/doctor')}
          >
            Doctor
          </button>
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate('/login/patient')}
          >
            Patient
          </button>
        </div>
      </div>
    );
  }

  // Login form
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/token/", { username, password });
      const token = res.data.access;
      const refreshToken = res.data.refresh;

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);

      const profile = await API.get("profile/");
      const role = profile.data.role;

      if (role !== expectedRole) {
        localStorage.removeItem("token");
        setError(`Access Denied! You are a ${role}, please use ${role} login.`);
        return;
      }

      login(token, refreshToken, role);

    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>{expectedRole === 'doctor' ? 'Doctor' : 'Patient'} Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <input
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button
          type="submit"
          className={`btn ${expectedRole === 'doctor' ? 'btn-primary' : 'btn-success'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : `Login as ${expectedRole === 'doctor' ? 'Doctor' : 'Patient'}`}
        </button>

      </form>

      <div className="mt-3 text-center">
        <button
          className="btn btn-link btn-sm"
          onClick={() => navigate('/login')}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default Login;