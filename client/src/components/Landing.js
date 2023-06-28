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
import ErrorPage from "../errors/ErrorPage";

const Landing = () => {
  const userId = window.localStorage.getItem("userId");
  const [profile, setProfile] = useState(false);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [doneTodos, setDoneTodos] = useState([]);
  const [En, setAr] = useState(true);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [todo, setTodo] = useState({
    text: "",
    state: false,
    userOwner: userId,
  });
  const [todosList, setTodosList] = useState([]);
  const [selectedTab, setSelectedTab] = useState([todosList]);
  const mode = localStorage.getItem('darkMode')
   

const toggelMode = (e) => {
  e.preventDefault();
  localStorage.setItem("darkMode", String(!isDarkMode));
  setIsDarkMode(!isDarkMode);
};

useEffect(() => {
  const mode = localStorage.getItem("darkMode");
  setIsDarkMode(mode === "true");
}, []);

  const toggelLang = (e) => {
    e.preventDefault();
    setAr(!En);
    console.log('Lang Togg');
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
      await axios.post("http://localhost:8080/todos", todo);
      alert("Todo added successfully");
      setTodo({
        text: "",
        state: false,
        userOwner: userId,
      });
    } catch (error) {
       setError(true);
      console.log(error);
    }
  };

  /////ADD TO & REMOVE FROM DONE
  const addToDone = async (todoId) => {
    try {
      // Make API call to mark the todo as done
      await axios.put("http://localhost:8080/todos", {
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
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
  const removeFromDone = async (todoId) => {
    try {
      await axios.delete(
        `http://localhost:8080/todos/done/${userId}/${todoId}`
      );
      setDoneTodos((prevDoneTodos) =>
        prevDoneTodos.filter((id) => id !== todoId)
      );
      console.log("Todo marked as not done");
    } catch (error) {
       setError(true);
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
      await axios.delete(`http://localhost:8080/todos/done/${userId}`);
      setCompletedTodos([]);
      console.log("Completed todos cleared");
    } catch (error) {
       setError(true);
      console.log(error);
    }
  };



  const isDone = (id) => doneTodos.includes(id);

  const deleteTodoItem = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/todos/${todoId}`);
      setTodosList((prevTodosList) =>
        prevTodosList.filter((todo) => todo._id !== todoId)
      );
      console.log("Todo deleted successfully");
      window.location.reload()
    } catch (error) {
       setError(true);
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
          `http://localhost:8080/todos?userId=${userId}`
        );
        setSelectedTab(response.data);
        setTodosList(response.data);
      } catch (error) {
        console.error(error);
         setError(true);
      }
    };
 
    fetchData();
    
  }, [userId]);

  useEffect(() => {
     const fetchCompletedTodos = async () => {
       try {
         const response = await axios.get(
           `http://localhost:8080/todos/done/${userId}`
         );
         const doneTodos = response.data.done.filter((todo) => todo !== null);

         const notDoneTodos = todosList.filter(
           (todo) =>
             !doneTodos.some((completedTodo) => completedTodo._id === todo._id)
         );

         setCompletedTodos(doneTodos);
         setActiveTodos(notDoneTodos);
       } catch (error) {
         setError(true);
         console.error(error);
       }
     };

     fetchCompletedTodos();
   
  }, [userId, doneTodos,todosList,completedTodos,activeTodos]);

  useEffect(() => {
    const fetchDoneTodos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/todos/done/ids/${userId}`
        );
        const doneTodos = response.data.done.filter((todo) => todo !== null);
        setDoneTodos(doneTodos);
      } catch (error) {
        console.error(error);
        setError(true);
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
        ></div>

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
                  placeholder="Add New Todo..."
                  value={todo.text}
                />
              </form>
            </div>
            {/* ************************* */}
            <div className="todos-pages">
              <div className="todo-list">
                <ul className="todo-ul">
                  {/* <AllTodos/> */}

                  {error ? (
                    <ErrorPage />
                  ) : (
                    selectedTab.map((todo) => (
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
                          <li
                            key={todo._id}
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
                  )}

                  {/* <AllTodos/> */}
                </ul>
              </div>
            </div>
            {/* ************************* */}

            <div className="todo-footer-links">
              <span>
                {activeTodos.length} {En ? "items left" : " المهام الباقية"}
              </span>
              <div className="links">
                <div onClick={() => setSelectedTab(todosList)} className="a">
                  {En ? "All" : " الكل"}
                </div>
                <div onClick={() => setSelectedTab(activeTodos)} className="a">
                  {En ? "Active" : "جاري العمل "}
                </div>
                <div
                  onClick={() => setSelectedTab(completedTodos)}
                  className="a"
                >
                  {En ? "Completed" : "تم"}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
