import React, { useState } from "react";
import axios from "axios";
import RenameGroupModal from "./RenameGroupModal";

const GroupHeader = ({ group }) => {
  const [isDeleted, setIsDeleted] = useState(false); // Track if the group is deleted
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // Track modal state

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://splitpy.onrender.com/group/${group.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleted(true); // Mark the group as deleted
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleRename = async (newName) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://splitpy.onrender.com/group/${group.id}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      group.name = newName; // Update the group's name
      setIsRenameModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  // If deleted, do not render anything
  if (isDeleted) return null;

  return (
    <div className="group-header flex items-center justify-between p-2 border-b">
      <h3 className="text-2xl font-semibold">{group.name}</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsRenameModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Rename
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>

      {/* RenameGroupModal */}
      <RenameGroupModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={handleRename}
      />
    </div>
  );
};

export default GroupHeader;
