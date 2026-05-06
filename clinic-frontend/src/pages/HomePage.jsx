import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function HomePage() {
  return (<div>
      <h2>Home Page</h2>
      <ul>

      <li><Link to="/login">Login</Link></li>
      <li> <Link to="/register">Patient Registration </Link></li>

     <li> <Link to="/register_doctor">Doctor Registration </Link></li>
     <li> <Link to="/doctor-list">Doctor List </Link></li>


    <li>  <Link to="/patient-list">Patient List</Link></li>
     </ul>
      </div>
  );

}
export default HomePage;