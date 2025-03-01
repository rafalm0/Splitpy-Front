import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionModal from "./TransactionModal"; // This is the modal we discussed earlier
import "./TransactionList.css";
import ExpandItem from "../assets/expand-height-line.svg"
import RetractItem from "../assets/collapse-vertical-line.svg"

const TransactionList = ({ groupId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [openTransactions, setOpenTransactions] = useState({}); // Example: {1: true, 2: false, 3: true}


  // Fetch transactions for the selected group
  const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `https://splitpy.onrender.com/group/${groupId}/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );


        const sortedTransactions = response.data.sort((a, b) => a.id - b.id);
        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };


    const toggleTransaction = (id) => {
    setOpenTransactions((prev) => ({
      ...prev,
      [id]: !prev[id], // Flip the open/close state for this specific item
    }));
    };
  // Handle Delete Transaction
  const handleDelTransaction = async (transactionId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (isConfirmed) {
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
    }
  };

  const handleEditTransaction = async (transactionId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `https://splitpy.onrender.com/transaction/${transactionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const transactionData = response.data;

    // Set editing state and open modal
    setEditingTransaction(transactionData);
    setIsModalOpen(true);

  } catch (error) {
    console.error("Error fetching transaction:", error);
  }
};

const onEditTransaction = async (transactionId, updatedTransaction) => {
  const token = localStorage.getItem("token");

  try {
    await axios.put(
      `https://splitpy.onrender.com/transaction/${transactionId}`,
      updatedTransaction,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchTransactions(); // Refresh transactions
    setIsModalOpen(false);
    setEditingTransaction(null); // Clear editing state

  } catch (error) {
    console.error("Error updating transaction:", error);
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
        New Transaction
      </button>
      <div className="inner-transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} >
            <div className="transaction-item">
              <p><strong>{transaction.description}</strong></p>
              <div className="collapsable-item" style={{ display: openTransactions[transaction.id] ? "block" : "none" }}>
                <div className="mini-transaction-header">
                  <p><strong>Total:</strong> ${transaction.price}</p>
                  <p><strong>Date:</strong> {transaction.created_at}</p>
                </div>
                <ul className="member-mini-list">
                  {transaction.members.map((member, index) => (

                   <li key={index} className="transaction-member-info">
                     <span>
                       <strong>{member.name} </strong> <br />
                       <strong>Paid: </strong> ${member.paid.toFixed(2)} <br />
                       <strong>Consumed: </strong> ${member.consumed.toFixed(2)}
                     </span>
                   </li>
                  ))}
                </ul>

                <div className="transaction-buttons">
                  <button className="delete-transaction-button"
                    onClick={() => handleDelTransaction(transaction.id)}>
                    Delete
                  </button>

                  <button className="edit-transaction-button"
                    onClick={() => handleEditTransaction(transaction.id)}>
                    Edit
                  </button>
                </div>
              </div>
              <button className="itemColapse-toggle" onClick={() => toggleTransaction(transaction.id)} >
                  <img
                    src={openTransactions[transaction.id] ? RetractItem : ExpandItem}
                    alt={openTransactions[transaction.id] ? "collapse" : "expand"}
                  />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        groupId={groupId}
        onAddTransaction={handleAddTransaction}
        editingTransaction={editingTransaction}
        onEditTransaction={onEditTransaction}
      />
    </div>
  );
};

export default TransactionList;
