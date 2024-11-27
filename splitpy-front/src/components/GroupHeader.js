import React, { useState } from "react";
import axios from "axios";

const GroupHeader = ({ group }) => {
  const [isDeleted, setIsDeleted] = useState(false); // Track if the group is deleted
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);

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

  const handleRename = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://splitpy.onrender.com/group/${group.id}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false); // Stop editing after renaming
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  // If deleted, do not render anything
  if (isDeleted) return null;

  return (
    <div className="group-header flex items-center justify-between p-2 border-b">
      <div>
        {!isEditing ? (
          <h3 className="text-2xl font-semibold">{group.name}</h3>
        ) : (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded p-1 text-gray-700"
          />
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <button
            onClick={handleRename}
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Rename
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GroupHeader;
