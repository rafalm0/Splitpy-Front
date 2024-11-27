import React, { useState } from "react";
import axios from "axios";

const RenameGroupModal = ({
  isOpen,
  onClose,
  groupId,
  currentName,
  onRenameSuccess,
}) => {
  const [newGroupName, setNewGroupName] = useState(currentName);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRename = async () => {
    const token = localStorage.getItem("token");
    if (!newGroupName) {
      setErrorMessage("Group name is required.");
      return;
    }

    try {
      // Send PUT request to rename the group
      await axios.put(
        `https://splitpy.onrender.com/group/${groupId}`,
        { name: newGroupName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onRenameSuccess(groupId, newGroupName); // Callback to update the UI
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error renaming group:", error);
      setErrorMessage("Failed to rename group.");
    }
  };

  return (
    isOpen && (
      <dialog open className="relative p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Rename Group</h2>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          placeholder="Enter new group name"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
    )
  );
};

export default RenameGroupModal;
