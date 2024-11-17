import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserGroups(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserGroups = async (token) => {
    try {
      const response = await axios.get('https://splitpy.onrender.com/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      setErrorMessage('Failed to load groups');
      console.error('Error fetching groups:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
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
                  groups.map((group, index) => (
                    <li key={index} className="group-item">
                      {group.name}
                    </li>
                  ))
                ) : (
                  <p>You are not part of any groups.</p>
                )}
              </ul>
            )}
          </div>
          <div className="main-content">
            <h1>Welcome to Split Py!</h1>
            <p>Manage your groups and expenses easily.</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="intro">
          <h1>Welcome to Split Py!</h1>
          <p className="catchphrase">Easily split your transactions and manage your expenses.</p>
          <p className="description">
            Whether you're splitting dinner with friends, or managing shared costs with your group,
            Split Py makes it simple and transparent for everyone involved.
          </p>

          <section className="cta">
            <h2>Ready to Start Splitting?</h2>
            <p>Join thousands of others who are using Split Py to simplify their expenses.</p>
            <Link to="/login">
              <button>Get Started</button>
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
