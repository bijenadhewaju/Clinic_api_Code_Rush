import React, { useState } from 'react';
import StatusBadge from './Status';

const AppointmentEdit = ({ appointment, onUpdate, onCancel, onUpdateStatus, role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: appointment.date,
    time: appointment.time,
    description: appointment.description
  });

  const handleSave = () => {
    onUpdate(appointment.id, editData);
    setIsEditing(false);
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(appointment.id, e.target.value);
  };

  return (
    <tr>
      <td>{appointment.id}</td>

      {role === 'patient' && (
        <td>
          <div className="fw-bold">Dr. {appointment.doctor_name}</div>
        </td>
      )}

      {role === 'doctor' && (
        <td>
          <div className="fw-bold">{appointment.patient_name || appointment.patient}</div>
        </td>
      )}

      <td>
        {isEditing ? (
          <input
            type="date"
            className="form-control form-control-sm"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
          />
        ) : (
          appointment.date
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="time"
            className="form-control form-control-sm"
            value={editData.time}
            onChange={(e) => setEditData({ ...editData, time: e.target.value })}
          />
        ) : (
          appointment.time
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
        ) : (
          <span className="text-muted small">{appointment.description || 'N/A'}</span>
        )}
      </td>

      <td>
        <StatusBadge status={appointment.status} />
      </td>

      <td>
        <div className="btn-group btn-group-sm">
          {role === 'patient' && (
            <>
              {isEditing ? (
                <>
                  <button className="btn btn-success" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onCancel(appointment.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {role === 'doctor' && (
            <select
              className="form-select form-select-sm"
              value={appointment.status}
              onChange={handleStatusChange}
              disabled={appointment.status === 'cancelled'}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AppointmentEdit;
