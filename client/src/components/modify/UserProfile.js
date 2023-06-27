import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const userId = window.localStorage.getItem("userId");

  useEffect(() => {
    

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/auth/${userId}`
        );
        console.log(response);
        const { email, username, phone, birthYear } = response.data.user;
        setEmail(email);
        setUsername(username);
        setPhone(phone);
        setBirthYear(birthYear);
      } catch (error) {
        // Handle error
      }
    };

    fetchUserData();
  }, [userId]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:8080/auth/register/${userId}`,
        {
          email,
          password,
          username,
          phone,
          birthYear,
        }
      );
      localStorage.setItem("username", response.data.user.username);
      const { message } = response.data;
      setMessage(message);
    } catch (error) {
      const { message } = error.response.data;
      setMessage("");
      setError(message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="left">
          <form className="form_container">
            <h1>Profile</h1>
            <div className="email">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="password">
              <label>Password:</label>
              <>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input pass"
                />
                <button className="eye" onClick={handleTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </>
            </div>
            <div className="username">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="phone">
              <label>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="birthYear">
              <label>Birth Year:</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
                className="input"
              />
            </div>
            {error && <div className="error_msg">{error}</div>}
            {message && <div className="success_msg">{message}</div>}
            <button type="submit" className="sign_btn" onClick={handleSubmit}>
              Save
            </button>
            <p className="signup">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
