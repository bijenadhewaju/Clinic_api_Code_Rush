import React from 'react'

const StatusBadge = ({ status }) => {
  const StatusColors = {
    pending: "bg-warning text-dark",
    approved: "bg-success",
    cancelled: "bg-danger",
    completed: "bg-primary",
    rejected: "bg-secondary",
    rescheduled: "bg-info text-dark",
  };

  return (
    <span className={StatusColors[status]}>
      {status.toUpperCase()}
    </span>
  )
}

export default StatusBadge;