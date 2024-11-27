import React, { useState } from "react";
import axios from "axios";

const GroupHeader = ({ group, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);

  const handleRename = async () => {
    const token = localStorage.getItem("token");
    try {
      // Send PUT request to rename the group
      await axios.put(
        `https://splitpy.onrender.com/group/${group.id}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Callback to update the UI with the new name
      onRename(group.id, newName);
      setIsEditing(false); // Stop editing after renaming
    } catch (error) {
      console.error("Error renaming group:", error);
      // Handle any error here, e.g., show an error message
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      // Send DELETE request to remove the group
      await axios.delete(`https://splitpy.onrender.com/group/${group.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Callback to remove the group from the UI
      onDelete(group.id);
    } catch (error) {
      console.error("Error deleting group:", error);
      // Handle any error here, e.g., show an error message
    }
  };

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
