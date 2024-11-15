import React from "react";
import './About.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>Welcome to Split Py</h1>
      <p>Split Py is a web application designed to help users easily split and manage transaction costs with friends, family, or groups.</p>
      <p>With Split Py, you can:</p>
      <ul>
        <li>Track transactions and group expenses</li>
        <li>Automatically calculate who owes what</li>
        <li>Keep a history of past transactions for future reference</li>
      </ul>
      <p>Built with Python on the back-end, this app aims to simplify cost-sharing and expense management.</p>
    </div>
  );
}

export default AboutPage;
