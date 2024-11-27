// GroupHeader.js
import React, { useState } from "react";
import axios from "axios";

const GroupHeader = ({ group, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);

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
      onRename(group.id, newName); // Callback to update UI
      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://splitpy.onrender.com/group/${group.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(group.id); // Callback to update UI
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <div className="group-header flex items-center justify-between p-4 border-b">
      {/* Group Name (with increased size) */}
      {!isEditing ? (
        <h3 className="text-2xl font-semibold">{group.name}</h3> // Make the name bigger
      ) : (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded p-2 text-gray-700"
        />
      )}

      {/* Buttons */}
      <div className="flex space-x-4">
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
