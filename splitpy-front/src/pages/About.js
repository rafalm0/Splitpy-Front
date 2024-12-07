import React from "react";
import './About.css';

function About() {
  return (
    <div className="about-container">
      <p>Settle Up is a web application designed to help users easily split and manage transaction costs with friends, family, or groups.</p>
      <p>With Settle Up, you can:</p>
      <ul>
        <li>Track transactions and group expenses</li>
        <li>Automatically calculate who owes what</li>
        <li>Keep a history of past transactions for future reference</li>
      </ul>
      <p>Built with Python and JavaScript alongside Flask and React, this app aims to simplify cost-sharing and expense management.</p>
    </div>
  );
}

export default About;
