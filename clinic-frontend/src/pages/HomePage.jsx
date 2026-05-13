import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container mt-5">
      <div className="jumbotron bg-light p-5 rounded shadow-sm text-center">
        <h1 className="display-4">Welcome to Clinic Management</h1>
        <hr className="my-4" />

        <div className="d-flex flex-column align-items-center gap-3 mt-4">

          <div className="d-flex gap-3">
            <Link to="/login/patient" className="btn btn-outline-success btn-lg px-4">Patient Login</Link>
          </div>

          <div className="d-flex gap-3">
            <Link to="/login/doctor" className="btn btn-outline-success btn-lg px-4">Doctor Login</Link>
          </div>

          <div className="d-flex gap-3">
            <Link to="/register-patient" className="btn btn-outline-primary btn-lg px-4">Patient Registration</Link>
          </div>

          <div>
            <Link to="/register-doctor" className="btn btn-outline-primary btn-lg px-4">Doctor Registration</Link>
          </div>

          <Link to="/admin" className="btn btn-outline-dark mt-3">Admin Panel</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;