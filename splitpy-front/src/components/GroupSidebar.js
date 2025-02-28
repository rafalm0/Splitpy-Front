import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GroupSidebar.css"; // You’ll create this file
import NewGroupModal from "../components/NewGroupModal"; // Import the new modal
import ExpandSidebar from "../assets/arrow-right-wide-line.svg"
import RetractSidebar from "../assets/contract-left-line.svg"

const GroupSidebar = ({ onSelectGroup, onAddGroupClick, setNewGroupName  }) => {
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open by default on desktop, closed on mobile

  const fetchUserGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://splitpy.onrender.com/group", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setGroups(response.data);
    } catch (error) {
      setErrorMessage("Failed to load groups");
      console.error("Error fetching groups:", error);
    }
  };




  useEffect(() => {
    fetchUserGroups();

    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Auto-open on larger screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`GroupSidebar ${isOpen ? "open" : "closed"}`}>
      <button className="GroupSidebar-toggle" onClick={() =>{
      setIsOpen(!isOpen);
      setShowModal(false)}}
      >
        <img
          src={isOpen ? RetractSidebar : ExpandSidebar}
          alt={isOpen ? "retract sidebar" : "expand sidebar"}
        />
      </button>

      {isOpen && (
        <div>
          <div className="GroupSidebar-spacer">
          </div>
          <h2>Groups</h2>
          {errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
          <div>
            <ul className="groups-list">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li
                    key={group.id}
                    className = "group-item"
                    onClick={() => onSelectGroup(group)}>
                    {group.name}
                  </li>
                ))
              ) : (
                <p>You are not part of any groups.</p>
              )}
            </ul>

            <button
              onClick={() => {
                setNewGroupName("");  // Clear name if needed
                onAddGroupClick();    // Ask parent to show modal
              }}
              className="create-group-button"
            >
              Add Group
            </button>
          </div>

          )}
        </div>
      )}





    </div>
  );
};

export default GroupSidebar;
