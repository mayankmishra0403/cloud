import React, { useState } from 'react';
import { account } from '../appwrite';
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // First, try to delete any existing sessions
      try {
        await account.deleteSession('current');
      } catch (err) {
        // Ignore errors if no session exists
      }
      
      if (isSignUp) {
        // Sign up flow
        await account.create('unique()', email, password, name);
        // Auto-login after sign up
        await account.createEmailSession(email, password);
        const user = await account.get();
        setUser(user);
      } else {
        // Login flow
        await account.createEmailSession(email, password);
        const user = await account.get();
        setUser(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Clear any existing sessions before OAuth
      try {
        await account.deleteSession('current');
      } catch (err) {
        // Ignore errors if no session exists
      }
      
      account.createOAuth2Session('google', window.location.origin, window.location.origin + '/login');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        {error && <div className="error">{error}</div>}
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        {!isSignUp && (
          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            Login with Google
          </button>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            style={{ marginLeft: '8px', background: 'none', color: '#2563eb', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
