import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction }) => {
  const [totalCost, setTotalCost] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [payers, setPayers] = useState([]);

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://splitpy.onrender.com/group/${groupId}/member`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMembers(response.data);
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };
      fetchMembers();
    }
  }, [isOpen, groupId]);

  const handleMemberChange = (memberId, isChecked, isPayer) => {
    setSelectedMembers((prev) => {
      if (isChecked) {
        return [...prev, memberId];
      }
      return prev.filter((id) => id !== memberId);
    });

    if (isPayer) {
      setPayers((prev) => {
        if (isChecked) {
          return [...prev, memberId];
        }
        return prev.filter((id) => id !== memberId);
      });
    }
  };

  const handleSubmit = () => {
    if (!totalCost || !description) {
      alert("Please fill in all the fields.");
      return;
    }
    const transaction = {
      totalCost,
      description,
      members: selectedMembers,
      payers,
    };
    onAddTransaction(transaction);
    setTotalCost("");
    setDescription("");
    setSelectedMembers([]);
    setPayers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Create Transaction</h2>
        <div className="input-group">
          <label>Total Cost</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            placeholder="Enter total cost"
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <h3>Involved Members</h3>
        <div className="member-list">
          {members.map((member) => (
            <div key={member.id} className="member-item">
              <input
                type="checkbox"
                onChange={(e) =>
                  handleMemberChange(member.id, e.target.checked, false)
                }
              />
              <label>{member.name}</label>
              <input
                type="checkbox"
                disabled={!selectedMembers.includes(member.id)}
                onChange={(e) =>
                  handleMemberChange(member.id, e.target.checked, true)
                }
              />
              <label>Payer</label>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSubmit} className="submit-button">
            Create Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
