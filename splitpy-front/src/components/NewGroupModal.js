import React from "react";
import "./NewGroupModal.css"; // Include your custom CSS

const NewGroupModal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null; // Do not render if modal is not open

  const handleClose = () => {
    onClose(); // Close the modal when the button is clicked
  };

  return (
    <div className="new-group-modal-overlay">
      <div className="new-group-modal-content">
        <h2 className="new-group-modal-title">{title}</h2>
        <div className="new-group-modal-body">
          {children} {/* Display the children components (inputs, etc.) */}
        </div>
        <div className="new-group-modal-footer">
          <button
            onClick={handleClose}
            className="new-group-modal-close-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
