import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction }) => {
  const [totalCost, setTotalCost] = useState("");
  const [amounts, setAmounts] = useState({});
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

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



  const handleEqualConsumptionChange = (isChecked) => {
    if (selectedMembers.length === 0 || totalCost === "") {
    alert("Please select members and enter a total cost first.");
    return;
    }

    // Distribute the total cost equally among selected members
    const perMember = totalCost / selectedMembers.length || 0;
    setAmounts((prev) => {
      const updated = { ...prev };
      selectedMembers.forEach((memberId) => {
        updated[memberId] = {
          ...updated[memberId],
          consumed: perMember, // Set equal consumption
        };
      });
      return updated;
    });

};

  const handleSubmit = async () => {
    if (!totalCost || !description) {
      alert("Please fill in all the fields.");
      return;
    }

    const membersRaw = selectedMembers.map((memberId) => ({
    member_id: memberId,
    amount_paid: amounts[memberId]?.paid || 0, // Get paid value or default to 0
    amount_consumed: amounts[memberId]?.consumed || 0, // Get consumed value or default to 0
  }));

  const transaction = {
    description,
    group_id: groupId,
    members_raw: membersRaw, // Use the correctly formatted membersRaw
  };

    try {
      await onAddTransaction(transaction);
      setTotalCost("");
      setDescription("");
      setSelectedMembers([]);
      setAmounts({});
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
        <div className="price-control">
        <div className="input-group">
          <label>Total Cost</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            placeholder="Enter total cost"
          />
        </div>
          <button onClick={handleEqualConsumptionChange} className="distribute-button">
            Distribute Consumption
        </button>
        </div>
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
              /><label>{member.name}</label>

              <input
                type="number"
                disabled={!selectedMembers.includes(member.id)}

                onChange={(e) =>
                    setAmounts((prev) => ({
                        ...prev,
                        [member.id]: {
                        ...prev[member.id],
                        paid: parseFloat(e.target.value) || 0,},
                    }))

                }
                placeholder="Paid"
              />

              <input
                type="number"
                disabled={!selectedMembers.includes(member.id)}

                value={amounts[member.id]?.consumed !== undefined
                       ? parseFloat(amounts[member.id].consumed).toFixed(2)
                       : ""}
                onChange={(e) =>
                    setAmounts((prev) => ({
                        ...prev,
                        [member.id]: {
                        ...prev[member.id],
                        consumed: parseFloat(e.target.value) || 0,},
                    }))

                }
                placeholder="Consumed"
              />

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
