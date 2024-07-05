import React from 'react';
import './CompanyDetailsModal.css';

function CompanyDetailsModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        <div className="company-details">
          <img src="/path/to/your/logo.png" alt="Company Logo" className="modal-logo" />
          <h2>Company Name</h2>
          <p>Company Slogan</p>
          <p>Additional company details go here.</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailsModal;
