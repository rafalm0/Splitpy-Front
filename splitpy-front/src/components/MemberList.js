import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMemberModal from "./AddMemberModal";
import DeleteBin from "../assets/delete-bin-line.svg"
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
    const isConfirmed = window.confirm("Are you sure you want to delete this member?");
    if (isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`https://splitpy.onrender.com/member/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers((prev) => prev.filter((member) => member.id !== memberId));
      } catch (error) {
        console.error("Error deleting member:", error);
        // Check if the error response exists and has a message
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("An unknown error occurred while deleting the member.");
        }
      }
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
      <h3 className="member-header">Members</h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="add-member-button"
      >
        Add Member
      </button>
      <div className="inner-member-list">
        {members.map((member) => (
          <div key={member.id} className="member-item">
            <h3 className='member-name'>{member.name.split(" ")[0]}  </h3>
            <button
              onClick={() => handleDeleteMember(member.id)}
              className="delete-member-button"
            >
              <img src={DeleteBin} alt="delete-member-button" />
            </button>
          </div>
        ))}
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={addMember}
      />
    </div>
  );
};

export default MemberList;
