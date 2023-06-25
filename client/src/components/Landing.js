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
  const userId = window.localStorage.getItem("userId");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState(true);
  const [todosList, setTodosList] = useState([]);
  const [allTodosList, setAllTodo] = useState([]);
  const [completedTodo, setCompletedTodo] = useState([]);
  const [activeTodo, setActiveTodo] = useState([]);
  const navigate = useNavigate();
  const [todo, setTodo] = useState({
    text: "",
    state: false,
    userOwner: userId,
  });

  useEffect(() => {
    const getTodoList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/todos?userId=${userId}`
        );
        setTodosList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    const getCompletefTodoList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/todos?userId=${userId}`
        );
        const filteredItems = response.data.filter(
          (item) => item.state === true
        );
        const activeItems = response.data.filter(
          (item) => item.state === false
        );
        setAllTodo(response.data);
        setActiveTodo(activeItems)
        setCompletedTodo(filteredItems);
      } catch (error) {
        console.error(error);
      }
    };
    getCompletefTodoList();
    getTodoList();
  }, []);

  const changeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
    e.target = "";
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/todos", todo);
      alert("Todo added successfully");
      setTodo({
        text: "",
        state: false,
        userOwner: userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addToCompletedTodo = async (todoId) => {
    try {
      const response = await axios.put("http://localhost:8080/todos", {
        todoId,
        userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggelMode = (e) => {
    e.preventDefault();
    setIsDarkMode(!isDarkMode);
    console.log('toggel');
  };

  const toggelLang = (e) => {
    e.preventDefault();
    setLang(!lang);
  };

  const updateTodoState = (e) => {
    setTodo({ ...todo, state: e.target.checked });
  };
  const AllListHandler = () => {
    setTodosList(allTodosList);
  };
  const activeListHandler = () => {
    setTodosList(activeTodo);
  };
  const compListHandler = () => {
    setTodosList(completedTodo);
  };

  return (
    <div className={isDarkMode ? "dark-mode main" : "light-mode main"}>
      <div className="main-container">
        <Navbar modeToggel={toggelMode}/>
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "20vh",
          }}
        ></div>
        {!cookies.access_token ? (
          navigate("/login")
        ) : (
          <div className="todos-main">
            <div className="add-todo">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.state}
                  onChange={updateTodoState}
                />
                <span className="checkmark"></span>
              </label>
              <form className="list-item" onBlur={addTodo}>
                <label htmlFor="text"></label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  onChange={changeHandler}
                  placeholder="Add New Todo..."
                  value={todo.text}
                />
              </form>
            </div>
            <div className="todo-list">
              <ul className="todo-ul">
                {todosList.map((todo) => {
                  return (
                    <div className="list-item" key={todo._id}>
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={todo.state}
                          onChange={changeHandler}
                          onClick={() => addToCompletedTodo(todo._id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <li className="item">{todo.text}</li>
                    </div>
                  );
                })}
              </ul>
            </div>
            <div className="todo-footer-links">
              <span>5 items left</span>
              <div className="links">
                <Link onClick={AllListHandler} className="a ">
                  All
                </Link>
                <Link onClick={activeListHandler} className="a active">
                  Active
                </Link>
                <Link className="a" onClick={compListHandler}>
                  Completed
                </Link>
              </div>
              <div className="clear-com">clear Com</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
