import React, { useState, useEffect } from "react";
import axios from "axios";

const MemberList = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>Error loading members: {error}</p>;
  if (members.length === 0) return <p>No members in this group.</p>;

  return (
    <div className="member-list">
      <h4 className="text-lg font-semibold mb-4">Group Members</h4>
      <ul className="list-disc pl-6">
        {members.map((member) => (
          <li key={member.id} className="mb-2">
            {member.name} ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
