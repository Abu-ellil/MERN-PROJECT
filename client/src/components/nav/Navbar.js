import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import "../nav/navbar.css";
import logo from "../../assets/logo.svg";

import night from "../../assets/Combined Shape.svg";
import light from "../../assets/light.svg";
import DropdownContainer from "../user/DropdownContainer";


export const Navbar = ({ modeToggel, toggleLang, en, mode, profile }) => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [lang, setLang] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="nav">
      <div className="nav-logo-txt">
        <img className="logo-svg" src={logo} alt="your todo logo" />
        Your Notes
      </div>
      <div className="nav-links">
        <button className="nav-btn lang" onClick={toggleLang}>
          {en ? "Ar" : "En "}
        </button>
        <button className="nav-btn " onClick={modeToggel}>
          <img src={mode ? night : light} alt="toggle mode icon" />
        </button>
        <DropdownContainer profile={profile} />
      </div>
    </div>
  );
};
