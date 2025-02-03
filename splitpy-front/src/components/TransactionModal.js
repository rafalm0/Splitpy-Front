import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction }) => {
  const [totalCost, setTotalCost] = useState("");
  const [amounts, setAmounts] = useState({});
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [retryCount, setRetryCount] = useState(0); // Retry counter

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setTotalCost("");
      setDescription("");
      setSelectedMembers([]);
      setAmounts({});
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

  // Function to handle retry logic
  const handleRetrySubmit = async () => {
    if (retryCount < 3) { // Limit retries to 3
      setRetryCount((prev) => prev + 1);
      await handleSubmit(); // Retry the request
    } else {
      alert("Transaction failed after multiple attempts.");
    }
  };

  const handleEqualConsumptionChange = (isChecked) => {
    if (selectedMembers.length === 0 || totalCost === "") {
      alert("Please select members and enter a total cost first.");
      return;
    }

    const numericTotalCost = parseFloat(totalCost) || 0; // Convert to a number safely
    const perMember = numericTotalCost / selectedMembers.length || 0;

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

    setIsLoading(true); // Start loading

    try {
      await onAddTransaction(transaction);
      setTotalCost("");
      setDescription("");
      setSelectedMembers([]);
      setAmounts({});
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      setIsLoading(false); // Stop loading on error
      handleRetrySubmit(); // Retry logic
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="transaction-modal-title">Create Transaction</h2>
        <div className="transaction-modal-input-group">
          <div className="transaction-modal-price-control">
            <div className="transaction-modal-input-group">
              <label>Total Cost</label>
              <input
                type="text"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="Enter total cost"
              />
            </div>
            <button onClick={handleEqualConsumptionChange} className="transaction-modal-distribute-button">
              Distribute Consumption
            </button>
          </div>
        </div>
        <div className="transaction-modal-input-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="transaction-modal-modal-footer">
          <button onClick={onClose} className="transaction-modal-cancel-button">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="transaction-modal-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Transaction"} {/* Show loading text */}
          </button>
        </div>

        <h3>Involved Members</h3>
        <div className="transaction-modal-member-list">
          {members.map((member) => (
            <div key={member.id} className="transaction-modal-member-item">
              <input
                type="checkbox"
                onChange={(e) => handleMemberChange(member.id, e.target.checked)}
              />
              <label className="member-name">{member.name} </label>

              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                onChange={(e) =>
                  setAmounts((prev) => ({
                    ...prev,
                    [member.id]: {
                      ...prev[member.id],
                      paid: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                placeholder="Paid"
              />

              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                value={amounts[member.id]?.consumed || ""} // Display the updated value
                onChange={(e) =>
                  setAmounts((prev) => ({
                    ...prev,
                    [member.id]: {
                      ...prev[member.id],
                      consumed: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                placeholder="Consumed"
              />
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default TransactionModal;
