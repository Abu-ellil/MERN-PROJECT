import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import "../nav/navbar.css";
import logo from "../../assets/logo.svg";
import user from "../../assets/user.png";
import night from "../../assets/Combined Shape.svg";
import light from "../../assets/light.svg";


export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [lang, setLang] = useState(true);
  const [mode, setMoode] = useState(true);
const navigate = useNavigate();




  const toggleMode = (e) => {
    e.preventDefault();
    setMoode(!mode)
  };
  const toggleLang = (e) => {
    e.preventDefault();
    setLang(!lang);
  };

  const logout = () => {
    setCookies("access_token", "");
    localStorage.removeItem("userId");
  };
  const login = () => {
   window.location = "/login";
  };

  return (
    <div className="nav">
      <div className="nav-logo-txt">
        
          <img className="logo-svg" src={logo} alt="your todo logo" />
          Your Notes
       
      </div>
      <div className="nav-links">
        <button className="nav-btn lang" onClick={toggleLang}>{lang ? "Ar" : "En"}</button>
        <button className="nav-btn" onClick={toggleMode}>
          <img src={mode ? night: light} alt="" />
        </button>

        <button className="nav-btn" to="/user">
          <img src={user} alt="" />
        </button>

        {!cookies.access_token ? (
          <button className="nav-btn" onClick={login}>login</button>
        ) : (
          <button className="nav-btn" onClick={logout}>
            LogOut
          </button>
        )}
      </div>
    </div>
  );
};
