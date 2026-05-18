import React from "react";

function MedicalHistory() {
  const medicalHistory = [
    {
      id: 1,
      doctor: "Dr. Sharma",
      date: "2026-05-10",
      time: "10:00 AM",
      diagnosis: "Common Cold",
      comments: "Patient is improving",
      prescription: "Paracetamol 500mg twice a day",
    },
    {
      id: 2,
      doctor: "Dr. Joshi",
      date: "2026-04-22",
      time: "02:00 PM",
      diagnosis: "Fever",
      comments: "High temperature observed",
      prescription: "Ibuprofen 400mg",
    },
    {
      id: 3,
      doctor: "Dr. Rai",
      date: "2026-03-15",
      time: "11:30 AM",
      diagnosis: "Migraine",
      comments: "Stress-related headache",
      prescription: "Rest + pain relief medication",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">Medical History</h2>
        <p className="text-muted">
          Your past consultations, diagnoses, and prescriptions
        </p>
      </div>

      <div className="row g-3">
        {medicalHistory.map((item) => (
          <div key={item.id} className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">

                {/* Top Row */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-primary">
                    {item.doctor}
                  </h5>

                  <span className="badge bg-secondary">
                    {item.date} • {item.time}
                  </span>
                </div>

                {/* Diagnosis */}
                <div className="mb-2">
                  <span className="badge bg-warning text-dark me-2">
                    Diagnosis
                  </span>
                  <span className="fw-semibold">
                    {item.diagnosis}
                  </span>
                </div>

                {/* Comments */}
                <p className="mb-2">
                  <strong>Doctor Notes:</strong>{" "}
                  <span className="text-muted">{item.comments}</span>
                </p>

                {/* Prescription */}
                <div className="p-2 rounded bg-light">
                  <strong>Prescription:</strong>{" "}
                  <span className="text-dark">
                    {item.prescription}
                  </span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalHistory;