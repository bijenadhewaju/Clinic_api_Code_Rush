import React, { useState } from 'react';
import AppointmentEdit from './AppointmentEdit';

const AppointmentTable = ({ appointments, onUpdate, onCancel, onUpdateStatus, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sorting, setSorting] = useState({ key: 'date', direction: 'asc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sorting.key === key && sorting.direction === 'asc') {
      direction = 'desc';
    }
    setSorting({ key, direction });
  };

  const filteredData = appointments
    .filter(item => {
      const searchTarget = role === 'patient' ? item.doctor_name : item.patient_name;
      const matchesSearch = (searchTarget && searchTarget.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a[sorting.key] < b[sorting.key])    //if a is smaller than b, return -1 means a comes first in ascending order
        return sorting.direction === 'asc' ? -1 : 1;

      if (a[sorting.key] > b[sorting.key])   //if a is greater than b, return 1 means b comes first in ascending order
        return sorting.direction === 'asc' ? 1 : -1;

      return 0;    //both equal
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h5 className="mb-0">Appointment History</h5>
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={`Search ${role === 'patient' ? 'doctor' : 'patient'} or description...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 text-end">
            <select
              className="form-select form-select-sm d-inline-block w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>ID</th>
                {role === 'patient' && <th style={{ cursor: 'pointer' }} onClick={() => handleSort('doctor_name')}>Doctor</th>}
                {role === 'doctor' && <th style={{ cursor: 'pointer' }} onClick={() => handleSort('patient_name')}>Patient</th>}
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>Date</th>
                <th>Time</th>
                <th>Description</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map(appt => (
                  <AppointmentEdit
                    key={appt.id}
                    appointment={appt}
                    onUpdate={onUpdate}
                    onCancel={onCancel}
                    onUpdateStatus={onUpdateStatus}
                    role={role}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No appointments found.</td>
                </tr>

              )}
            </tbody>
          </table>

        </div>
      </div>

      <div className="card-footer bg-white py-3">
        <nav aria-label="Page navigation">
          <ul className="pagination pagination-sm justify-content-center mb-0">

            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
            </li>

            {[...Array(totalPages)].map((_, i) => (

              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>

            ))}

            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AppointmentTable;
