import backgroundImage from "../assets/main-cover.png";
import React, { useState, useEffect } from "react";
import night from "../assets/Combined Shape.svg";
import { useCookies } from "react-cookie";
import { Navbar } from "./nav/Navbar";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./landing.css";

const Landing = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState(true);
  const [todos, setTodos] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const navigate = useNavigate();

  const toggelMode = (e) => {
    e.preventDefault();
    setIsDarkMode(!isDarkMode);
  };
  const toggelLang = (e) => {
    e.preventDefault();
    setLang(!lang);
  };
  const todosList = axios
    .get("http://localhost:8080/todos")
    .then((resp) => setTodos(resp.data))
    .catch((err) => console.log(err));

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <Navbar />
      <div
        className="main-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "20vh",
        }}
      >
        {!cookies.access_token ? (
          <h1>you are not logged in </h1>
        ) : (
          <div className="todos-main">
            <div className="add-todo"></div>
            <div className="todo-list">
              <ul className="todo-ul">
                {todos.map((todo) => {
                  return (
                    <div className="list-item">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                        <span className="checkmark"></span>
                      </label>

                      <li className="list-item">{todo.text}</li>
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
