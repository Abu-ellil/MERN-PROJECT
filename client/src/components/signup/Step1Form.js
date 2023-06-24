import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/main-logo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Step1Form = ({ handleNext }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
const [showErrorMessage, setShowErrorMessage] = useState(false);


  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
      });
      const userId = response.data.userId;


      await handleNext(userId);


    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
useEffect(() => {
  if (error) {
    setShowErrorMessage(true);
    const timer = setTimeout(() => {
      setShowErrorMessage(false);
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [error]);

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
            <h1>Signup</h1>
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
                  type="password"
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
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="sign_btn">
              Next
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

export default Step1Form;
