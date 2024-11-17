import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form">
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          value={username}
          onChange={handleUsernameChange}
        />
        {showPassword && (
          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />
        )}
        <button type="submit" className="submit-button" disabled={!showPassword}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
