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
          Settle Up
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li>
                <button className="nav-link logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li>
                <button
                  className="nav-link about-button"
                  onClick={() => window.location.href = "/about"}>
                  About
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <button
                  className="nav-link about-button"
                  onClick={() => window.location.href = "/about"}>
                  About
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}



export default Header;



//
//<script type="text/javascript">
//    document.getElementById("about-button").onclick = function () {
//        window.location.href = "http://localhost:3000/about"
//        };
//</script>