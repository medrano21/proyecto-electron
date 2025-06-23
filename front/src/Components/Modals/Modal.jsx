import { useEffect } from 'react';
import "./Modal.css"
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizes = {
    sm: "400px",
    md: "600px",
    lg: "800px",
    xl: "1000px"
  };

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: sizes[size] }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>

      </div>
    </div>
  );
};

export default Modal;
