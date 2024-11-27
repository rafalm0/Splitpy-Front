import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NewGroupModal from "../components/NewGroupModal"; // Import the new modal
import GroupHeader from "../components/GroupHeader"; // Import GroupHeader
import "./Home.css";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected group
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserGroups(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserGroups = async (token) => {
    try {
      const response = await axios.get("https://splitpy.onrender.com/group", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setGroups(response.data);
    } catch (error) {
      setErrorMessage("Failed to load groups");
      console.error("Error fetching groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token");
    if (!token || !newGroupName) return;

    try {
      await axios.post(
        "https://splitpy.onrender.com/group",
        { name: newGroupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewGroupName("");
      setShowModal(false);
      fetchUserGroups(token); // Refresh the group list
    } catch (error) {
      setErrorMessage("Failed to create group");
      console.error("Error creating group:", error);
    }
  };

  // Rename callback to update UI
  const handleRename = (groupId, newName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
  };

  // Delete callback to update UI
  const handleDelete = (groupId) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    setSelectedGroup(null); // Deselect the group after deletion
  };

  return (
    <div className="home-page">
      {isAuthenticated ? (
        <div className="home-content">
          <div className="sidebar">
            <h2>Your Groups</h2>
            {errorMessage ? (
              <p>{errorMessage}</p>
            ) : (
              <ul className="groups-list">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <li
                      key={group.id}
                      className="group-item"
                      onClick={() => setSelectedGroup(group)} // Set the selected group
                    >
                      {group.name}
                    </li>
                  ))
                ) : (
                  <p>You are not part of any groups.</p>
                )}
              </ul>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="create-group-button"
            >
              Create New Group
            </button>
          </div>
          <div className="main-content">
            {selectedGroup ? (
              <GroupHeader
                group={selectedGroup}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ) : (
              <p>Select a group from the sidebar to view details.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="intro">
          <h1>Welcome to Split Py!</h1>
          <p className="catchphrase">
            Easily split your transactions and manage your expenses.
          </p>
          <p className="description">
            Whether you're splitting dinner with friends, or managing shared
            costs with your group, Split Py makes it simple and transparent for
            everyone involved.
          </p>

          <section className="cta">
            <h2>Ready to Start Splitting?</h2>
            <p>
              Join thousands of others who are using Split Py to simplify their
              expenses.
            </p>
            <Link to="/login">
              <button>Get Started</button>
            </Link>
          </section>
        </div>
      )}

      <NewGroupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSecondaryAction={() => console.log("Secondary action executed")}
        title="Create New Group"
      >
        <input
          type="text"
          placeholder="Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleCreateGroup}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Create
        </button>
      </NewGroupModal>
    </div>
  );
}

export default Home;
