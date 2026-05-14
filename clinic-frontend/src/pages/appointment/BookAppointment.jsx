import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("clinic/doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // No `patient` field — the backend assigns it automatically
      // from the logged-in user (see appointment_list POST in views.py)
      await API.post("clinic/appointment/", {
        doctor,
        date,
        time,
      });

      alert("Appointment Booked!");
      navigate("/patient-dashboard");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Booking failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setDoctor(e.target.value)} value={doctor}>
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.username}
            </option>
          ))}
        </select>

        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <input type="time" onChange={(e) => setTime(e.target.value)} />

        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default BookAppointment;