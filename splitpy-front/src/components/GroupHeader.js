import React, { useState } from "react";
import axios from "axios";
import RenameGroupModal from "./RenameGroupModal";
import "./GroupHeader.css";
import BalanceModal from "./BalanceModal"

const GroupHeader = ({ group }) => {
  const [isDeleted, setIsDeleted] = useState(false); // Track if the group is deleted
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // Track modal state
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const isConfirmed = window.confirm("Are you sure you want to delete this Group?");
    if (isConfirmed){
      try {
        await axios.delete(`https://splitpy.onrender.com/group/${group.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsDeleted(true); // Mark the group as deleted
      } catch (error) {
        console.error("Error deleting group:", error);
      }
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
    <div className="group-header">
      <h3 className="group-header-name">{group.name}</h3>
      <h3 className="group-header-filler"></h3>
      <div className="group-header-buttons">
        <button className="balance-button"
          onClick={() => setIsBalanceModalOpen(true)}
        >
          Show Balance
        </button>
        <BalanceModal
          isOpen={isBalanceModalOpen}
          onClose={() => setIsBalanceModalOpen(false)}
          groupId={group.id}
        />
        <button
          onClick={() => setIsRenameModalOpen(true)}
          className="rename-button"
        >
          Rename Group
        </button>
        <button
          onClick={handleDelete}
          className="delete-group-button"
        >
          Delete Group
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
