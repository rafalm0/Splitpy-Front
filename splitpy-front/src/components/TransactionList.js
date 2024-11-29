import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionModal from "./TransactionModal"; // This is the modal we discussed earlier
import "./TransactionList.css";

const TransactionList = ({ groupId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch transactions for the selected group
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://splitpy.onrender.com/group/${groupId}/transaction`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleAddTransaction = async (transaction) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://splitpy.onrender.com/group/${groupId}/transaction`,
        transaction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTransactions(); // Refresh the list of transactions
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [groupId]);

  return (
    <div className="transaction-list">
      <h3 className="transaction-header">Transactions</h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="add-transaction-button"
      >
        Create New Transaction
      </button>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-item">
            <p><strong>Description:</strong> {transaction.description}</p>
            <p><strong>Total Cost:</strong> ${transaction.totalCost}</p>
            <p><strong>Involved Members:</strong> {transaction.members.join(", ")}</p>
            <p><strong>Payers:</strong> {transaction.payers.join(", ")}</p>
          </li>
        ))}
      </ul>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupId={groupId}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default TransactionList;
