import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMemberModal from "./AddMemberModal";
import "./MemberList.css";

const MemberList = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");
    try {
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

  const handleDeleteMember = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://splitpy.onrender.com/member/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const addMember = async (newMember) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://splitpy.onrender.com/group/${groupId}/member`,
        newMember,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMembers(); // Refresh the list
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  return (
    <div className="member-list">
      <h3 className="member-header">Group Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id} className="member-item">
            <span>
              <h3 className='member-name'>{member.name}  </h3>
            </span>
            <button
              onClick={() => handleDeleteMember(member.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setIsModalOpen(true)}
        className="add-member-button"
      >
        Add Member
      </button>
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={addMember}
      />
    </div>
  );
};

export default MemberList;
