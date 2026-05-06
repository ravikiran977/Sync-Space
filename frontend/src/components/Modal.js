// src/components/Modal.js

import React, { useEffect } from "react";
import "../styles/Modal.css";

function Modal({ isOpen, onClose, children }) {
  
  // 👉 Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // 👉 Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Stop closing when clicking inside modal */}
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close button */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Dynamic content */}
        {children}

      </div>
    </div>
  );
}

export default Modal;