import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async event => {
      event.preventDefault();
      if (!username || !password) {
          const m = username ? "Please enter password." : "Please enter username.";
          setMessage(m);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        // Response will be used to validate username and password
        if (!response.ok) {
          throw new Error('Failed to login');
        }

        setIsLoggedIn(true);
        navigate("/home");
      } catch (err) {
        setMessage(err.message);
      }
    };


    return (
      <div className="container">
        <h1>Log In</h1>
        <div className="main-content">
          <form>
            <div>
              <input type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="Username"/>
            </div>
            <div>
              <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Password"/>
            </div>
            {message && <p>{message}</p>}
            <input type="submit" value="Log In" onClick={handleSubmit}/>
          </form>
        </div>
      </div>
    );
}

export default Login;