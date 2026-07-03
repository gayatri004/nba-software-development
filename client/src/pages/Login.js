import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = () => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      navigate("/dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>NBA Software Development</h1>
        <p>Admin Login</p>

        <input
          type="text"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>Login</button>

        
      </div>
    </div>
  );
}

export default Login;