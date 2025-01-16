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
          `https://splitpy.onrender.com/transaction`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filter transactions for the selected group
        const filteredTransactions = response.data.filter(
          (transaction) => transaction.group_id === groupId
        );

        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

  // Handle Delete Transaction
  const handleDelTransaction = async (transactionId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://splitpy.onrender.com/transaction/${transactionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTransactions(); // Refresh the list of transactions
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };



  // Add Transaction (from previous implementation)
  const handleAddTransaction = async (transaction) => {
  const token = localStorage.getItem("token");
  try {
    // Add group_id to the transaction object
    const payload = {
      ...transaction,
      group_id: groupId, // Include group_id in the JSON body
    };

    await axios.post(
      `https://splitpy.onrender.com/transaction`, // Adjusted URL
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchTransactions(); // Refresh the list of transactions
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
              <p><strong>Total Cost:</strong> ${transaction.price !== undefined ? transaction.price.toFixed(2) : ""}</p>
              <p>
                <strong>Involved Members:</strong>{" "}
                {transaction.members.map((member) => member.name).join(", ")}
              </p>

              <button
              className="delete-transaction-button"
              onClick={() => handleDelTransaction(transaction.id)}>
              Delete Transaction
            </button>
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
