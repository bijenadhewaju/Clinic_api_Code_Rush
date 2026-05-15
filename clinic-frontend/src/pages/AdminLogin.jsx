import { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthManager";
import API from "../services/api";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/token/", { username, password });
      const token = res.data.access;

      // Temporarily store to verify role
      localStorage.setItem("token", token);
      const profile = await API.get("profile/");
      const role = profile.data.role;

      if (role !== 'admin') {
        localStorage.removeItem("token");
        setError("Access denied. This portal is for admins only.");
        return;
      }

      login(token, 'admin');

    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <input
          className="form-control"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-dark">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLogin;
