import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Home.css'; // Assuming Home.css is in the same folder

function Home() {
  return (
    <div className="home-page">
      <section className="intro">
        <h1>Welcome to Split Py!</h1>
        <p className="catchphrase">Easily split your transactions and manage your expenses.</p>
        <p className="description">
          Whether you're splitting dinner with friends, or managing shared costs with your group,
          Split Py makes it simple and transparent for everyone involved.
        </p>
      </section>

      <section className="features">
        <h2>Features of Split Py</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Simple Transactions</h3>
            <p>Split costs quickly and easily with a few clicks.</p>
          </div>
          <div className="card">
            <h3>Group Management</h3>
            <p>Invite people to your groups and track their expenses.</p>
          </div>
          <div className="card">
            <h3>Transparency</h3>
            <p>Everyone can see the shared expenses, ensuring fairness.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Start Splitting?</h2>
        <p>Join thousands of others who are using Split Py to simplify their expenses.</p>
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </section>


    </div>
  );
}

export default Home;
