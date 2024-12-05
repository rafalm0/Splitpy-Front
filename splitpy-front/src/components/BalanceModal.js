import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BalanceModal.css";

const BalanceModal = ({ isOpen, onClose, groupId }) => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchBalances();
    }
  }, [isOpen]);

  const fetchBalances = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://splitpy.onrender.com/balance/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalances(response.data);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  return (
    <div className={`balance-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>Group Balances</h2>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
        <ul>
          {balances.map((balance, index) => (
            <li key={index}>
              <p><strong>Payer:</strong> {balance.payer}</p>
              <p><strong>Receiver:</strong> {balance.receiver}</p>
              <p><strong>Amount:</strong> ${parseFloat(balance.amount).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BalanceModal;
