import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction }) => {
  const [totalCost, setTotalCost] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [payers, setPayers] = useState([]);

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

  const handleMemberChange = (memberId, isChecked) => {
    setSelectedMembers((prev) =>
      isChecked ? [...prev, memberId] : prev.filter((id) => id !== memberId)
    );
  };

  const handlePayerChange = (memberId, isChecked) => {
    setPayers((prev) =>
      isChecked ? [...prev, memberId] : prev.filter((id) => id !== memberId)
    );
  };

  const handleSubmit = async () => {
    if (!totalCost || !description) {
      alert("Please fill in all the fields.");
      return;
    }

    const membersRaw = selectedMembers.map((memberId) => ({
      member_id: memberId,
      is_payer: payers.includes(memberId),
    }));

    const transaction = {
      description,
      price: parseFloat(totalCost),
      group_id: groupId,
      members_raw: membersRaw,
    };

    try {
      await onAddTransaction(transaction);
      setTotalCost("");
      setDescription("");
      setSelectedMembers([]);
      setPayers([]);
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
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
                onChange={(e) => handleMemberChange(member.id, e.target.checked)}
              />
              <label>{member.name}</label>
              <input
                type="checkbox"
                disabled={!selectedMembers.includes(member.id)}
                onChange={(e) => handlePayerChange(member.id, e.target.checked)}
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
