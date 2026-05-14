import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const StatusColors = {
    pending: "bg-warning text-dark",    // yellow
    approved: "bg-success",             // green
    completed: "bg-secondary",          // grey
    cancelled: "bg-danger",             // red
    rescheduled: "bg-info text-dark",   // blue
  };

  const statusLower = status.toLowerCase();
  const className = StatusColors[statusLower] || "bg-light text-dark";

  return (
    <span className={`badge ${className}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;