import React, { useState } from "react";
import axios from "axios";
import AddMemberModal from "./AddMemberModal";
import './MemberList.css';

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
      fetchMembers(); // Refresh the member list
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, [groupId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Group Members</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Member
        </button>
      </div>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="p-2 border rounded">
            {member.name} | {member.email}
          </li>
        ))}
      </ul>
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={addMember}
      />
    </div>
  );
};

export default MemberList;
