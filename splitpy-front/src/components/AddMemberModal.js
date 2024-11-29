import React, { useState } from "react";

const AddMemberModal = ({ isOpen, onClose, onAddMember }) => {
  const [name, setName] = useState("");

  const handleAddMember = () => {
    if (!name) {
      alert("Please fill in the name.");
      return;
    }
    onAddMember({ name });
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter member's name"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            className="submit-button"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
