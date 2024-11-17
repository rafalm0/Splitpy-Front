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
    window.location.href = '/';         // Redirect to home
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          Split Py
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            {!isAuthenticated ? (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            ) : (
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            )}
            {/* Conditionally render the About link based on authentication */}
            {!isAuthenticated && (
              <Link to="/about" className="nav-link">
                About
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
