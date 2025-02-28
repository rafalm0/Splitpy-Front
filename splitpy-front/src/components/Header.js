import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);  // User is logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setIsAuthenticated(false);         // Update authentication state
    window.location.href = '/login';         // Redirect to home
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        Settle Up
      </Link>
      <div className="nav-itens">
        <button className="button" onClick={handleLogout}>
          {isAuthenticated ? ("Logout" ) : ("Login")}
        </button>
        <button className="button" onClick={() => window.location.href = "/about"}>
          About
        </button>
      </div>
    </header>
  );
}

export default Header;
