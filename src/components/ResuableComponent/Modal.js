// Modal.js
import React, { useEffect, useState } from 'react';
import './Modal.css';


const Modal = ({ children, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ background:"rgba(0, 0, 0, 0)",opacity: visible ? 1 : 0 }}>
      <div
        className={`modal-content ${visible ? 'modal-content-enter-active' : 'modal-content-enter'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
