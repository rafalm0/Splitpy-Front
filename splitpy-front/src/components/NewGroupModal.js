// TailwindModal.js
import React from "react";
import "./NewGroupModal.css"; // Optional: Include Tailwind and custom styles if needed

const NewGroupModal = ({
  isOpen,
  onClose,
  onSecondaryAction,
  title,
  children,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {onClose(); };

  return (
    <dialog open className="relative p-6 bg-white rounded-lg shadow-lg showing">

      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="mb-4 text-gray-700">{children}</div>
      <div className="flex justify-end space-x-2">

        <button
          onClick={handleClose}
          className="px-4 py-2 text-white bg-indigo-500 rounded">
          Close
        </button>
      </div>
    </dialog>
  );
};

export default NewGroupModal;
