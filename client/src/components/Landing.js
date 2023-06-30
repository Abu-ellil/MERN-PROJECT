import React, { useState, useEffect } from "react";
import Notification from "./popup/Notification";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Navbar } from "./nav/Navbar";
import UserProfile from "./modify/UserProfile";
import ErrorPage from "../errors/ErrorPage";
import backgroundImage from "../assets/main-cover.png";
import night from "../assets/Combined Shape.svg";
import "./landing.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./landing.css";

const Landing = () => {
  const userId = window.localStorage.getItem("userId");
  const [profile, setProfile] = useState(false);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [doneTodos, setDoneTodos] = useState([]);
  const [En, setAr] = useState(true);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [error, setError] = useState("");
  const [errPage, setErrPage] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [todo, setTodo] = useState({
    text: "",
    state: false,
    userOwner: userId,
  });
  const [todosList, setTodosList] = useState([]);
  const [selectedTab, setSelectedTab] = useState([todosList]);
  const mode = localStorage.getItem("darkMode");

  useEffect(() => {
    const mode = localStorage.getItem("darkMode");
    setIsDarkMode(mode === "true");
  }, []);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      const parsedLanguage = JSON.parse(storedLanguage);
      setAr(parsedLanguage);
    }
  }, []);

  const toggelLang = (e) => {
    e.preventDefault();
    const updatedEn = !En;
    localStorage.setItem("language", JSON.stringify(updatedEn));
    setAr(updatedEn);
  };

  const toggelMode = (e) => {
    e.preventDefault();
    localStorage.setItem("darkMode", String(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  };

  const changeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
    e.target = "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://mern-todo-project-my1v.onrender.com/todos?userId=${userId}`
        );
        setSelectedTab(response.data);
        setTodosList(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
        // setErrPage(error)
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await axios.get(
          `https://mern-todo-project-my1v.onrender.com/todos/done/${userId}`
        );
        const doneTodos = response.data.done.filter((todo) => todo !== null);

        const notDoneTodos = todosList.filter(
          (todo) =>
            !doneTodos.some((completedTodo) => completedTodo._id === todo._id)
        );

        setCompletedTodos(doneTodos);
        setActiveTodos(notDoneTodos);
      } catch (error) {
        setTimeout(() => {
          setError(null);
        }, 2000);
        console.log(error);
      }
    };

    fetchCompletedTodos();
  }, [todosList, userId]);

  useEffect(() => {
    const fetchDoneTodos = async () => {
      try {
        const response = await axios.get(
          `https://mern-todo-project-my1v.onrender.com/todos/done/ids/${userId}`
        );
        const doneTodos = response.data.done.filter((todo) => todo !== null);
        setDoneTodos(doneTodos);
      } catch (error) {
        setError(error.message);
        setErrPage(error);
        setTimeout(() => {
          setError(null);
        }, 2000);
        console.log(error);
      }
    };

    fetchDoneTodos();
  }, [doneTodos, userId]);

  const addTodo = async (e) => {
    // e.preventDefault();
    try {
      if (todo.text.trim() === "") {
        throw new Error(
          En ? "You have to write something" : "لابد من كتابة شيء"
        );
      }
      const response = await axios.post(
        "https://mern-todo-project-my1v.onrender.com/todos",
        todo
      );
      setTodosList((prevTodosList) => [...prevTodosList, response.data]);
      setCompletedTodos(response.data);
      window.location.reload();
      setMessage(En ? "Todo added successfully" : "تمت إضافة المهمة بنجاح");
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 2000);

      setTodo({
        text: "",
        state: false,
        userOwner: userId,
      });
    } catch (error) {
      // setError(error.message);
      // setErrPage(errPage)
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const removeFromDone = async (todoId) => {
    try {
      await axios.delete(
        `https://mern-todo-project-my1v.onrender.com/todos/done/${userId}/${todoId}`
      );
      setDoneTodos((prevDoneTodos) =>
        prevDoneTodos.filter((id) => id !== todoId)
      );
      console.log("Todo marked as not done");

      setMessage(En ? "Todo marked as Active" : "تم التعديل كنشط");

      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      //       setError(error.message);
      // setErrPage(error)
      setTimeout(() => {
        setError(null);
      }, 2000);
      console.log(error);
    }
  };

  const updateTodoState = async (e, todoId) => {
    const isChecked = e.target.checked;
    setTodo({ ...todo, state: isChecked });

    if (isChecked) {
      await addToDone(todoId);
    } else {
      await removeFromDone(todoId);
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      setMessage(En ? "PLS wait a sec" : "برجاء الانتظار قليلا");
      setTimeout(() => {
        setMessage(null);
      }, 6000);
      await axios.delete(
        `https://mern-todo-project-my1v.onrender.com/todos/done/${userId}`
      );

      setCompletedTodos([]);
      console.log("Completed todos cleared");
      setMessage(En ? "Completed todos cleared" : "تم مسح المكتمل");
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const addToDone = async (todoId) => {
    try {
     
      await axios.put("https://mern-todo-project-my1v.onrender.com/todos", {
        todoId,
        userId,
      });
      const completedTodo = activeTodos.find((todo) => todo._id === todoId);
      setCompletedTodos((prevCompletedTodos) => [
        ...prevCompletedTodos,
        completedTodo,
      ]);
     
      setActiveTodos((prevActiveTodos) =>
        prevActiveTodos.filter((todo) => todo._id !== todoId)
      );
      console.log("Todo marked as done");
 
      setMessage(En ? "Todo marked as done" : "تم الاضافة للمكتمل");
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const isDone = (id) => doneTodos.includes(id);

  const deleteTodoItem = async (todoId) => {
    try {
      const response = await axios.delete(
        `https://mern-todo-project-my1v.onrender.com/todos/${todoId}`
      );
      console.log(response);
        setTodosList((prevTodosList) =>
      prevTodosList.filter((todo) => todo._id !== todoId)
  
      );
      setMessage(En ? "Todo deleted successfully" : "تم المسح بنجاح");
      setTimeout(() => {
        setMessage(null);
      }, 2000);
      console.log("Todo deleted successfully");

      window.location.reload();
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
      console.log(error);
    }
  };

  const profileToggle = () => {
    setProfile(!profile);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div
      className={
        isDarkMode
          ? `dark-mode main ${En ? "Ar" : "rtl"}`
          : `light-mode main ${En ? "Ar" : "rtl"}`
      }
    >
      <div className="main-container">
        <Navbar
          modeToggel={toggelMode}
          toggleLang={toggelLang}
          profile={profileToggle}
          en={En}
          mode={!isDarkMode}
        />
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "25vh",
          }}
        ></div>
        {message && (
          <div>
            <div className="pop-up">
              <div className="slide-container">
                <div className="slide-content">{message}</div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error_msg err">{error}</div>}

        {profile ? (
          <UserProfile profileToggle={profileToggle} />
        ) : true && !cookies.access_token ? (
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
              <form
                className="add-item"
                onBlur={addTodo}
                onKeyPress={handleKeyPress}
              >
                <label htmlFor="text"></label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  onChange={changeHandler}
                  placeholder={En ? "Add New Todo..." : "انشاء مهمة جديدة."}
                  value={todo.text}
                />
              </form>
              <button className="add">➕</button>
            </div>
            {/* ************************* */}
            <div className="todos-pages">
              <div className="todo-list">
                <ul className="todo-ul">
                  {/* <AllTodos/> */}

                  {error ? (
                    <ErrorPage />
                  ) : selectedTab.length > 0 ? (
                    selectedTab.map((todo) => (
                      <div className="list-item" key={todo._id + 2}>
                        <div className="check-todo">
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={isDone(todo._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addToDone(todo._id);
                                } else {
                                  removeFromDone(todo._id);
                                }
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <li
                            key={todo._id + 1}
                            className={
                              doneTodos.includes(todo._id)
                                ? "done item"
                                : "item"
                            }
                          >
                            {todo.text}
                          </li>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => deleteTodoItem(todo._id)}
                        >
                          X
                        </button>
                      </div>
                    ))
                  ) : (
                    <h2 className="empty-list-text">
                      {" "}
                      {En
                        ? "Empty list, Pls add todo"
                        : "لا يوجد مهام، قم بإضافة واحدة"}
                    </h2>
                  )}

                  {/* <AllTodos/> */}
                </ul>
              </div>
            </div>
            {/* ************************* */}

            <div className="todo-footer-links big">
              <span className="not-done">
                {activeTodos.length} {En ? "items left" : "مهام باقية"}
              </span>
              <div className="links">
                <div
                  onClick={() => setSelectedTab(todosList)}
                  className={selectedTab === todosList ? "a active" : "a"}
                >
                  {En ? "All" : " الكل"}
                </div>
                <div
                  onClick={() => setSelectedTab(activeTodos)}
                  className={
                    selectedTab === activeTodos ? "a mid active" : "a mid"
                  }
                >
                  {En ? "Active" : "نشط"}
                </div>
                <div
                  onClick={() => setSelectedTab(completedTodos)}
                  className={selectedTab === completedTodos ? "a active" : "a"}
                >
                  {En ? "Completed" : "مكتمل"}
                </div>
              </div>
              {completedTodos.length > 0 && (
                <>
                  <div className="clear-com" onClick={deleteCompletedTodos}>
                    {En ? "Clear Completed" : "مسح المنتهي"}
                  </div>
                </>
              )}
            </div>

            <div className="com-not">
              <span className="not-done">
                {activeTodos.length} {En ? "items left" : "مهام باقية"}
              </span>

              {completedTodos.length > 0 && (
                <>
                  <div className="clear-com" onClick={deleteCompletedTodos}>
                    {En ? "Clear Completed" : "مسح المنتهي"}
                  </div>
                </>
              )}
            </div>

            <div className="todo-footer-links mini">
              <div className="links">
                <div
                  onClick={() => setSelectedTab(todosList)}
                  className={selectedTab === todosList ? "a active" : "a"}
                >
                  {En ? "All" : " الكل"}
                </div>
                <div
                  onClick={() => setSelectedTab(activeTodos)}
                  className={
                    selectedTab === activeTodos ? "a mid active" : "a mid"
                  }
                >
                  {En ? "Active" : "نشط"}
                </div>
                <div
                  onClick={() => setSelectedTab(completedTodos)}
                  className={selectedTab === completedTodos ? "a active" : "a"}
                >
                  {En ? "Completed" : "مكتمل"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
