import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);  // True = Login, False = Sign Up
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state

  const toggleForm = () => {
    setIsLogin(!isLogin);  // Switch between login and sign up
  };

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';  // Redirect to login after logout
  };

  return (
    <div className="login-container">
      <div className="form-container">
        {isLogin ? (
          <LoginForm />
        ) : (
          <SignUpForm />
        )}

        <button className="submit-button" onClick={toggleForm}>
          {isLogin ? 'Create an Account' : 'Already have an account? Login'}
        </button>

        {/* Show logout button if authenticated */}
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Username:', username);  // Check username
      console.log('Password:', password);  // Check password

      try {
        const response = await axios.post('https://splitpy.onrender.com/login', {
          username,
          password,
        });
        console.log('Response:', response);  // Check the response
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        window.location.href = '/';  // Redirect to home after successful login
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Invalid username or password');
      }
    };

  return (
    <div className="form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      await axios.post('https://splitpy.onrender.com/register', {
        username,
        email,
        password,
      });
      alert('Account created successfully! Now you can log in.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage('Error creating account');
    }
  };

  return (
    <div className="form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Login;
