import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/main-logo.svg";
import { Link } from "react-router-dom";


const Step2Form = ({ handleComplete, userId }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/auth/register/${userId}`, {
        username,
        phone,
        birthYear,
        userId,
      });
      await handleComplete();
    } catch (error) {
      alert(error.response.data.message);
    }
  };




  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="right">
          <div className="right-logo">
            <div className="logo-text">
              <img src={logo} alt="" />
              <h1>Your Notes</h1>
            </div>
          </div>
        </div>
        <div className="left">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Complete Signup</h1>
            <div className="email">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="email">
              <label>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="email">
              <label>Birth Year:</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="sign_btn">
              Complete Registration
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

export default Step2Form;
