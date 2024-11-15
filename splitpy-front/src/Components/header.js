
// src/components/Header.js

import React from 'react';
import './Header.css'; // Import the CSS for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Split Py</h1>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/" className="nav-link">Home</a></li>
          <li><a href="/about" className="nav-link">About</a></li>
          <li><a href="/contact" className="nav-link">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;