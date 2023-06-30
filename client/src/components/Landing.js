import backgroundImage from "../assets/main-cover.png";
import React, { useState, useEffect } from "react";
import night from "../assets/Combined Shape.svg";
import { useCookies } from "react-cookie";
import { Navbar } from "./nav/Navbar";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./landing.css";
import UserProfile from "./modify/UserProfile";

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

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://mern-todo-project-my1v.onrender.com/todos",
        todo
      );
      // alert("Todo added successfully");
      setMessage("Todo added successfully");
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 3000);
      setTodo({
        text: "",
        state: false,
        userOwner: userId,
      });
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 3000);
      console.log(error);
      setMessage("Todo added successfully");
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 3000);
      setError("Todo added successfully");

      setTimeout(() => {
        setError(null);
      }, 3000);
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
      setMessage("Todo marked as Active");
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      setError(error);

      setTimeout(() => {
        setError(null);
      }, 3000);
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
      await axios.delete(
        `https://mern-todo-project-my1v.onrender.com/todos/done/${userId}`
      );
      setCompletedTodos([]);
      console.log("Completed todos cleared");
      setMessage("Completed todos cleared");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const addToDone = async (todoId) => {
    try {
      // Make API call to mark the todo as done
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

      setMessage("Todo marked as done");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const isDone = (id) => doneTodos.includes(id);

  const deleteTodoItem = async (todoId) => {
    try {
      await axios.delete(
        `https://mern-todo-project-my1v.onrender.com/todos/${todoId}`
      );
      setTodosList((prevTodosList) =>
        prevTodosList.filter((todo) => todo._id !== todoId)
      );
      setMessage("Todo deleted successfully");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      console.log("Todo deleted successfully");
      window.location.reload();
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 3000);
      console.log(error);
    }
  };

  const profileToggle = () => {
    setProfile(!profile);
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
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 3000);
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
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 3000);
        console.error(error);
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    };

    fetchCompletedTodos();
  }, [userId, doneTodos, todosList, completedTodos, activeTodos]);

  useEffect(() => {
    const fetchDoneTodos = async () => {
      try {
        const response = await axios.get(
          `https://mern-todo-project-my1v.onrender.com/todos/done/ids/${userId}`
        );
        const doneTodos = response.data.done.filter((todo) => todo !== null);
        setDoneTodos(doneTodos);
      } catch (error) {
        setError(error);
        setTimeout(() => {
          setError(null);
        }, 3000);
        console.error(error);
      }
    };

    fetchDoneTodos();
  }, [activeTodos]);

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
        >
          {message && (
            <div>
              <div className="pop-up">
                <div className="slide-container">
                  <div className="slide-content">{message}</div>
                </div>
              </div>
            </div>
          )}
          {error && <div className="error_msg pop-up">{error}</div>}
        </div>

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
              <form className="add-item" onBlur={addTodo}>
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
            </div>
            {/* ************************* */}
            <div className="todos-pages">
              <div className="todo-list">
                <ul className="todo-ul">
                  {/* <AllTodos/> */}

                  {selectedTab.map((todo) => (
                    <div className="list-item" key={todo._id}>
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
                        <li className="item" key={todo._id}>
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
                  ))}

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
