import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    API.get("profile/").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Profile;