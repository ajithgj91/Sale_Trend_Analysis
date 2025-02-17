// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginAdmin.css";

// const LoginAdmin = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
    
//     // Mock authentication (Replace with real authentication logic)
//     if (username === "admin" && password === "password123") {
//       localStorage.setItem("isAuthenticated", "true");
//       const redirectPath = localStorage.getItem("redirectPath") || "/dashboard";
//       localStorage.removeItem("redirectPath");
//       navigate(redirectPath);
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Admin Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Username:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginAdmin;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginAdmin.css";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      navigate(location.state?.redirectTo || "/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginAdmin;