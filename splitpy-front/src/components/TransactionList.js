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
          { group_id: groupId },
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
              <p><strong>Total Cost:</strong> ${transaction.price.toFixed(2)}</p>
              <p>
                <strong>Group:</strong> {transaction.group.name}
              </p>
              <p>
                <strong>Involved Members:</strong>{" "}
                {transaction.members.map((member) => member.name).join(", ")}
              </p>
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
