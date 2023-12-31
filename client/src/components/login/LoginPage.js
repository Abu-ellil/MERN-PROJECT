import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import logo from "../../assets/main-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [_, setCookies] = useCookies(["access_token"]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [En, setAr] = useState(true);
   const toggelLang = (e) => {
     e.preventDefault();
     setAr(!En);
     console.log("Lang Togg");
   };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://server1-aejd.onrender.com/auth/login",
        data
      );
      setCookies("access_token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("username", response.data.user.username);
      navigate("/");
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
          <h1> {En ? "Login" : "تسجيل دخول"}</h1>
          <form className="form_container" onSubmit={handleSubmit}>
            <div className="email">
              <label> {En ? "Email:" : "البريد:"}</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="input"
              />
            </div>
            <div className="password">
              <label> {En ? "Password:" : "كلمة المرور"}</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className="input pass"
              />
              <button className="eye" onClick={handleTogglePassword}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="sign_btn">
              {En ? "Sing In" : "سجل الدخول"}
            </button>
            <p className="signup">
              {En ? "Don't have an account?" : "ليس لديك حساب؟ يمكنك من هنا"}
              <Link to="/signup"> {En ? "Sing Up" : " انشاء حساب"}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
