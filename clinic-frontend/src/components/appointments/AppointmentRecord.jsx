import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const AppointmentRecord = ({ appointment, onUpdate, onCancel }) => {
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

  return (
    <tr>
      <td>{appointment.id}</td>

      <td>
        <div className="fw-bold">Dr. {appointment.doctor_name}</div>
      </td>

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
          {isEditing ? (
            <>
              <button className="btn btn-success" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
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
        </div>
      </td>
    </tr>
  );
};

export default AppointmentRecord;
