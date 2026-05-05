import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

function Login({ setIsLoggedIn, setUsername }) {
  const [username, setUsernameInput] = useState('');
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
      const response = await fetch('https://vocab-learn-api.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Response will be used to validate username and password in Sprint 3.
      if (!response.ok) {
        throw new Error('Username or password is incorrect');
      }

      localStorage.setItem('token', data.token);

      setIsLoggedIn(true);
      setUsername(username);

      navigate("/home");
    } 
    catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <div className="main-content" style = {{ textAlign: 'center' }}>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="text" value={username} onChange={event => setUsernameInput(event.target.value)} placeholder="Username"/>
          </div>
          <div>
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Password"/>
          </div>
          {message && <p>{message}</p>}
          <input type="submit" value="Log In" />
          <input type="button" value="Register" onClick={() => navigate('/register')} />
        </form>
      </div>
    </div>
  );
}

export default Login;