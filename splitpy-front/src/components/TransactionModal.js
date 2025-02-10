import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionModal.css";

const TransactionModal = ({ isOpen, onClose, groupId, onAddTransaction, editingTransaction, onEditTransaction }) => {
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
      setDescription(editingTransaction?.description ?? "");
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

          if (editingTransaction) {
          console.log(editingTransaction);
          setSelectedMembers(editingTransaction.members.map(m => m.id));
          const updatedAmounts = editingTransaction.members.reduce((acc, member) => {
            acc[member.id] = {
              consumed: member.consumed ?? 0,
              paid: member.paid ?? 0 // Ensures it takes the correct value

            };
            return acc;
          }, {});
          setAmounts(updatedAmounts); // Update amounts state

          console.log("Editing Transaction Data:", editingTransaction); // Debugging
          console.log("Updated Amounts State:", updatedAmounts); // Check if values are correct

        } else {
            // Reset to default when creating a new transaction
            setSelectedMembers([]);
            setAmounts({});
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
          consumed: parseFloat(perMember.toFixed(2)), // Round to 2 decimal places
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
      amount_paid: parseFloat(amounts[memberId]?.paid) || 0,
      amount_consumed: parseFloat(amounts[memberId]?.consumed) || 0, // Convert safely here
    }));

    const transaction = {
      description,
      group_id: groupId,
      members_raw: membersRaw, // Use the correctly formatted membersRaw
    };

    setIsLoading(true); // Start loading

    try {
      if (editingTransaction) {
      await onEditTransaction(editingTransaction.id, transaction); // Call edit function
    } else {
      await onAddTransaction(transaction); // Call add function
    }

    } catch (error) {
      console.error("Error creating transaction:", error);
      setIsLoading(false); // Stop loading on error
      handleRetrySubmit(); // Retry logic
    }
    setTotalCost("");
    setDescription("");
    setSelectedMembers([]);
    setAmounts({});
    onClose();
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
          <button onClick={handleSubmit} className="transaction-modal-submit-button" disabled={isLoading}>
            {isLoading ? "Saving..." : editingTransaction ? "Update Transaction" : "Create Transaction"}
          </button>
        </div>

        <h3>Involved Members</h3>
        <div className="transaction-modal-member-list">
          {members.map((member) => (
            <div key={member.id} className="transaction-modal-member-item">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)} // This ensures it's visually checked
                onChange={(e) => handleMemberChange(member.id, e.target.checked)}
              />
              <label className="member-name">{member.name} </label>

              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                value={amounts[member.id]?.paid !== undefined ? amounts[member.id].paid : ""}
                onChange={(e) => {
                const inputValue = e.target.value;

                // Allow only numbers and a single dot
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setAmounts((prev) => ({
                    ...prev,
                    [member.id]: {
                      ...prev[member.id],
                      paid: inputValue, // Store as string for now
                    },
                  }));
                }
                }}
                placeholder="Paid"
              />

              <input
                type="text"
                disabled={!selectedMembers.includes(member.id)}
                value={amounts[member.id]?.consumed !== undefined ? amounts[member.id].consumed : ""}
                onChange={(e) => {
                const inputValue = e.target.value;

                // Allow only numbers and a single dot
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setAmounts((prev) => ({
                    ...prev,
                    [member.id]: {
                      ...prev[member.id],
                      consumed: inputValue, // Store as string for now
                    },
                  }));
                }
                }}
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
