import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    specialization: "",
    experience: "",
    gender: "",
    phone: "",
    age: "",
    blood_group: "",
    is_available: true
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      setFormData(res.data);
      setLoading(false);
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to load profile." });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      await API.put("profile/", formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "danger", text: "Update failed. Please try again." });
    }
  };

  if (loading) return <div className="mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Edit Profile</h2>
          
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({type: "", text: ""})}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 text-start">
                <label className="form-label small fw-bold">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 text-start">
                <label className="form-label small fw-bold">Gender</label>
                <select 
                  name="gender" 
                  className="form-select" 
                  value={formData.gender || "other"} 
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Role-specific fields */}
              {formData.role === 'doctor' && (
                <>
                  <div className="col-md-6 text-start">
                    <label className="form-label small fw-bold">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      className="form-control"
                      value={formData.specialization || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label small fw-bold">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      className="form-control"
                      value={formData.experience || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 text-start">
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                        id="availableSwitch"
                      />
                      <label className="form-check-label small" htmlFor="availableSwitch">Available for Appointments</label>
                    </div>
                  </div>
                </>
              )}

              {formData.role === 'patient' && (
                <>
                  <div className="col-md-6 text-start">
                    <label className="form-label small fw-bold">Age</label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      value={formData.age || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label small fw-bold">Blood Group</label>
                    <select 
                      name="blood_group" 
                      className="form-select" 
                      value={formData.blood_group || ""} 
                      onChange={handleChange}
                    >
                      <option value="">Select...</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;