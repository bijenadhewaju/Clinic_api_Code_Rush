import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthManager";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    description: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    API.get("clinic/doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.log(err));
  }, []);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("clinic/appointment/", {
        ...formData
      });

      showMsg("Appointment booked successfully!", "success");
      setFormData({ doctor: '', date: '', time: '', description: '' });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard/patient");
      }, 1500);

    } catch (error) {
      console.log(error);
      showMsg(error.response?.data?.error || "Failed to book appointment.", "danger");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0"><i className="bi bi-calendar-plus me-2"></i>Book New Appointment</h5>
        </div>
        <div className="card-body">
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Doctor</label>
                <select
                  name="doctor"
                  className="form-select"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.username} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description / Symptoms</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe your concern..."
                ></textarea>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary px-4">
                  Confirm Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;