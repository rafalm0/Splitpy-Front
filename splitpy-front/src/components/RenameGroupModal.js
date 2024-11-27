import React, { useState } from "react";
import "./RenameGroupModal.css"; // Optional: Include Tailwind and custom styles if needed

const RenameGroupModal = ({ isOpen, onClose, onRename, currentName }) => {
  const [newName, setNewName] = useState(currentName);

  if (!isOpen) return null;

  const handleRename = () => {
    onRename(newName); // Trigger the rename action
    onClose(); // Close the modal
  };

  return (
    <dialog open className="relative p-6 bg-white rounded-lg shadow-lg showing">
      <h2 className="mb-4 text-lg font-semibold">Rename Group</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded text-gray-700"
          placeholder="Enter new group name"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleRename}
          className="px-4 py-2 text-white bg-indigo-500 rounded"
        >
          Save
        </button>
      </div>
    </dialog>
  );
};

export default RenameGroupModal;
