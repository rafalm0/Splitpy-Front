import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction, editingTransaction, onEditTransaction }) => {
  const [amounts, setAmounts] = useState({});
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDescription(editingTransaction?.description ?? "");
      setSelectedMembers([]);
      setAmounts({});
      setIsLoading(false);
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

          if (editingTransaction) {
            setSelectedMembers(editingTransaction.members.map(m => m.id));
            const updatedAmounts = editingTransaction.members.reduce((acc, member) => {
              acc[member.id] = {
                consumed: member.consumed ?? "",
                paid: member.paid ?? ""
              };
              return acc;
            }, {});
            setAmounts(updatedAmounts);
          }
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

  const totalCost = selectedMembers.reduce((sum, memberId) => sum + (parseFloat(amounts[memberId]?.paid) || 0), 0);

  const handleEqualConsumptionChange = () => {
    if (selectedMembers.length === 0 || totalCost === 0) {
      alert("Please select members and enter payment amounts first.");
      return;
    }

    const numericTotalCost = parseFloat(totalCost) || 0; // Convert to a number safely
    const perMemberBase = Math.floor((numericTotalCost / selectedMembers.length) * 100);
    let totalBase = Math.round(perMemberBase * selectedMembers.length);
    let discrepancy = Math.round((numericTotalCost * 100) - totalBase); // Remaining cents to distribute
    // Create a new object with calculated amounts
    const updatedAmounts = { ...amounts };

    selectedMembers.forEach((memberId) => {
      let value = perMemberBase;
      if (discrepancy > 0) {
        value += 1;
        discrepancy -= 1;
      }

      updatedAmounts[memberId] = {
        ...updatedAmounts[memberId],
        consumed: (value / 100).toFixed(2), // Ensure perfect sum
      };
    });

    setAmounts(updatedAmounts);
  };

  const handleSubmit = async () => {
    if (!description) {
      alert("Please fill description.");
      return;
    }

    const membersRaw = selectedMembers.map((memberId) => ({
      member_id: memberId,
      amount_paid: parseFloat(amounts[memberId]?.paid) || 0,
      amount_consumed: parseFloat(amounts[memberId]?.consumed) || 0,
    }));

    const transaction = {
      description,
      group_id: groupId,
      members_raw: membersRaw,
    };

    setIsLoading(true);

    try {
      if (editingTransaction) {
        await onEditTransaction(editingTransaction.id, transaction);
      } else {
        await onAddTransaction(transaction);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      setIsLoading(false);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="transaction-modal-title">Create Transaction</h2>
        <div className="transaction-modal-input-group">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter transaction name / description"
          />
        </div>
        <div className="transaction-modal-member-list">
          {members.map((member) => (
            <div key={member.id} className="transaction-modal-member-item">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)}
                onChange={(e) => handleMemberChange(member.id, e.target.checked)}
              />
              <label className="member-name">{member.name} </label>
              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                value={amounts[member.id]?.paid ?? ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    setAmounts((prev) => ({
                      ...prev,
                      [member.id]: {
                        ...prev[member.id],
                        paid: inputValue,
                      },
                    }));
                  }
                }}
                placeholder="Paid"
              />
              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                value={amounts[member.id]?.consumed ?? ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    setAmounts((prev) => ({
                      ...prev,
                      [member.id]: {
                        ...prev[member.id],
                        consumed: inputValue,
                      },
                    }));
                  }
                }}
                placeholder="Consumed"
              />
            </div>
          ))}
        </div>

        <div className="transaction-modal-footer">
          <h3>Total: ${totalCost.toFixed(2)}</h3>
          <button onClick={handleEqualConsumptionChange} className="transaction-modal-distribute-button">
            Distribute Consumption
          </button>
          <button onClick={onClose} className="transaction-modal-cancel-button">
            Cancel
          </button>
          <button onClick={handleSubmit} className="transaction-modal-submit-button" disabled={isLoading}>
            {isLoading ? "Saving..." : editingTransaction ? "Update Transaction" : "Create Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
