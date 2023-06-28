import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/main-logo.svg";
import { Link } from "react-router-dom";


const Step2Form = ({ handleComplete, userId,toggleLang,en }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [En, setAr] = useState(true);
  const toggelLang = (e) => {
    e.preventDefault();
    setAr(!En);
    console.log("Lang Togg");
  };
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
    <div className={`login_container ${En ? "Ar" : "rtl"}`}>
      <div className="login_form_container">
        <div className="right">
          <div></div>
          <div className="right-logo">
            <div className="logo-text">
              <img src={logo} alt="" />
              <h1>Your Notes</h1>
            </div>
          </div>
          <div className="lang-btn-container">
            <button className="nav-btn lang lang-log" onClick={toggelLang}>
              {En ? "Ar" : "En "}
            </button>
          </div>
        </div>
        <div className="left">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>{En ? "Complete Signup" : "اكمال البيانات"}</h1>
            <div className="email">
              <label>{En ? "Username:" : ":اسم المستخدم"}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="email">
              <label>Phone:{En ? "Phone:" : "الهاتف:"}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="email">
              <label>{En ? "Birth Year:" : "سنة الميلاد:"}</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="sign_btn">
              {En ? "Complete Registration" : "انهاء التسجيل"}
            </button>
            <p className="signup">
              {En ? "Already have an account?" : "لديك حساب بالفعل؟"}{" "}
              <Link to="/login">{En ? "Login" : "تسجيل الدخول"}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step2Form;
