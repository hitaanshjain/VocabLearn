import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = event => {
      event.preventDefault();
      if (!username || !password) {
          const m = username ? "Please enter password." : "Please enter username.";
          setMessage(m);
        return;
      }
      setIsLoggedIn(true);
      navigate("/home");
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
  };

export default Login;