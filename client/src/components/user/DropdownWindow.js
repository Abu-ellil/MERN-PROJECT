import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const DropdownWindow = ({ isOpen, onClose }) => {
    const userName = window.localStorage.getItem("username");
    const [cookies, setCookies] = useCookies(["access_token"]);
    const logout = () => {
      setCookies("access_token", "");
      localStorage.removeItem("userId");
    };
    const login = () => {
      window.location = "/login";
    };
  return (
    <div className={`dropdown-window ${isOpen ? "open" : ""}`}>
      <div className="dropdown-content">
        <div className="drop-inside">
            <h1>hi {userName}</h1>
            <div className="btns">
          <Link className="btn drop-btn-in" to={'/profile'}>Modify User info</Link>
          {!cookies.access_token ? (
            <button className="btn drop-btn-out" onClick={login}>
              login
            </button>
          ) : (
            <button className="btn drop-btn-out" onClick={logout}>
              {true ? "LogOut" : "تسجيل خروج"}
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownWindow;
