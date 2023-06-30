import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./profile.css";

const UserProfile = ({ profileToggle }) => {
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
          `https://mern-todo-project-my1v.onrender.com/auth/${userId}`
        );
        const { email, username, phone, birthYear } = response.data.user;
        setEmail(email);
        setUsername(username);
        setPhone(phone);
        setBirthYear(birthYear);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `https://mern-todo-project-my1v.onrender.com/auth/register/${userId}`,
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

  const handleTogglePassword = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword);
  };

  return (
    <div className="profile_container">
      <h1>Modify User Information</h1>
      <div className="profile_form_container">
        <div className="pofile">
          <form className="profile-form">
            <div className="email p-input">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pinput"
              />
            </div>
            <div className="password p-input">
              <label>Password:</label>
              <>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pinput pass"
                />
                <button className="eye" onClick={handleTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </>
            </div>
            <div className="username p-input">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pinput"
              />
            </div>
            <div className="phone p-input">
              <label>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="pinput"
              />
            </div>
            <div className="birthYear p-input">
              <label>Birth Year:</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
                className="pinput"
              />
            </div>
            {error && <div className="error_msg">{error}</div>}
            {message && <div className="success_msg">{message}</div>}
            <button type="submit" className="sign_btn" onClick={handleSubmit}>
              Save Changes
            </button>
            <p className="signup">
              Go To Todos{" "}
              <button className="back" onClick={profileToggle}>
                Home
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
