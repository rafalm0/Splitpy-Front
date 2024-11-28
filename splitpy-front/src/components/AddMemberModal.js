import React, { useState } from "react";

const AddMemberModal = ({ isOpen, onClose, onAddMember }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAddMember = () => {
    if (!name) {
      alert("Please fill in the name.");
      return;
    }
    onAddMember({ name });
    setName("");
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog open className="relative p-6 bg-white rounded-lg shadow-lg showing">
      <h2 className="mb-4 text-lg font-semibold">Add New Member</h2>
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter member's name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-700">Email(Inviting friends still not implemented):</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter member's email"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMember}
          className="px-4 py-2 text-white bg-indigo-500 rounded"
        >
          Add Member
        </button>
      </div>
    </dialog>
  );
};

export default AddMemberModal;
