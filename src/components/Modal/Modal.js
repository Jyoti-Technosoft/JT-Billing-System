// Modal.js
import React, { useEffect, useState } from 'react';
import './Modal.css';

const Modal = ({ children, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ opacity: visible ? 1 : 0 }}>
      <div
        className={`modal-content ${visible ? 'modal-content-enter-active' : 'modal-content-enter'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
