import React, { useState, useEffect } from 'react';
import API from "../../services/api";
import BookAppointment from './BookAppointment';
import AppointmentTable from './AppointmentTable';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptsRes, docsRes] = await Promise.all([
        API.get("clinic/appointment/"),
        API.get("clinic/doctors/")
      ]);
      setAppointments(apptsRes.data);
      setDoctors(docsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showMsg("Failed to load appointments.", "danger");
    }
  };

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleBook = async (formData) => {
    try {
      // Patient ID is hardcoded for now or fetched from context/auth
      const patientId = 1; 
      await API.post("clinic/appointment/", { ...formData, patient: patientId });
      showMsg("Appointment booked successfully!", "success");
      fetchData();
    } catch (error) {
      showMsg(error.response?.data?.error || "Failed to book appointment.", "danger");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await API.patch(`clinic/appointment/${id}/`, { 
        ...updatedData, 
        status: 'Rescheduled' 
      });
      showMsg("Appointment updated successfully!", "success");
      fetchData();
    } catch (error) {
      showMsg("Failed to update appointment.", "danger");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await API.patch(`clinic/appointment/${id}/`, { status: 'Cancelled' });
      showMsg("Appointment cancelled.", "success");
      fetchData();
    } catch (error) {
      showMsg("Failed to cancel appointment.", "danger");
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 fw-bold">Appointment Management</h2>
          
          <BookAppointment 
            doctors={doctors} 
            onBook={handleBook} 
            message={{...message, clear: () => setMessage({text:'', type:''})}} 
          />
          
          <AppointmentTable 
            appointments={appointments} 
            onUpdate={handleUpdate} 
            onCancel={handleCancel} 
          />
        </div>
      </div>
    </div>
  );
};

export default Appointments;
