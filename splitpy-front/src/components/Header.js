// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>My Awesome App</h1>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
