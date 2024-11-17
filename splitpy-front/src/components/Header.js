import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
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
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
