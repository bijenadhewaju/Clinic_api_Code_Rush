import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
          const res = await axios.post("/api/token/", {
            username,
            password,
          });

        //  store token
        localStorage.setItem("token", res.data.access);
        //  get role
        const profile = await API.get("profile/");
        const role = profile.data.role;

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/patient-dashboard");
        }

    } catch (err) {
        console.log(err);
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;