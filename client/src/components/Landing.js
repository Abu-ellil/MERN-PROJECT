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
import CompletedTodos from "./todos/CompletedTodos ";
import ActiveTodos from "./todos/ActiveTodos";
import AllTodos from "./todos/AllTodos";

const Landing = () => {
  const userId = window.localStorage.getItem("userId");
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [doneTodos, setDoneTodos] = useState();
  const [En, setAr] = useState(true);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [allTodosList, setAllTodo] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const navigate = useNavigate();
  const [todo, setTodo] = useState({
    text: "",
    state: false,
    userOwner: userId,
  });
  const [todosList, setTodosList] = useState(allTodosList);

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
  const getCompletedTodoList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/todos/done/ids/${userId}`
      );
      setDoneTodos(response.data.done);
      setCompletedTodos(response.data.done);
    } catch (err) {
      console.log(err);
    }
  };

  ///////////////
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

  const toggelMode = (e) => {
    e.preventDefault();
    setIsDarkMode(!isDarkMode);
    console.log("toggel");
  };

  const toggelLang = (e) => {
    e.preventDefault();
    setAr(!En);
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
      console.log(error);
    }
  };

  //////ADD TO COMP
  const addToDone = async (todoId) => {
    try {
      await axios.put("http://localhost:8080/todos", {
        todoId,
        userId,
      });
      setCompletedTodos((prevCompletedTodo) => [...prevCompletedTodo, todoId]);
      console.log("Todo marked as done");
    } catch (error) {
      console.log(error);
    }
  };

  const isDone = (id) => doneTodos.includes(id);

  const AllListHandler = () => {
    setTodosList(allTodosList);
  };

  const activeListHandler = () => {
    const active = allTodosList.filter(
      (todo) => !completedTodos.includes(todo._id["$oid"])
    );
    setTodosList(active);
  };

  const compListHandler = () => {
    const completed = allTodosList.filter((todo) =>
      completedTodos.includes(todo._id["$oid"])
    );
    setTodosList(completed);
  };

  //////DELETE
  const deleteTodoItem = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/todos/${todoId}`);
      setTodosList((prevTodosList) =>
        prevTodosList.filter((todo) => todo._id !== todoId)
      );
      console.log("Todo deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompletedTodoList();
    getTodoList();
  }, [todosList]);
  useEffect(() => {
    setActiveTodos(
      
    );
  }, [todosList, completedTodos]);
  return (
    <div className={isDarkMode ? "dark-mode main" : "light-mode main"}>
      <div className="main-container">
        <Navbar modeToggel={toggelMode} toggleLang={toggelLang} />
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
                {/* {todosList.map((todo) => {
                    return (
                      <div className="list-item" key={todo._id}>
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
                        <li className="item">{todo.text}</li>
                        <button
                          className="delete-button"
                          onClick={() => deleteTodoItem(todo._id)}
                        >
                          X
                        </button>
                      </div>
                    );
                  })
                } */}
              </ul>
            </div>
            <div className="todo-footer-links">
              <span>
                {activeTodos.length} {activeTodos.length}{" "}
                {En ? "items left" : " المهام الباقية"}
              </span>
              <div className="links">
                <Link to="/all" className="a">
                  {" "}
                  {En ? "All" : " الكل"}
                </Link>
                <Link to="/active" className="a">
                  {" "}
                  {En ? "Active" : "جاري العمل "}
                </Link>
                <Link to="/completed" className="a">
                  {" "}
                  {En ? "Completed" : "تم"}
                </Link>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/all"
            element={
              <AllTodos
                todos={todosList}
                isDone={isDone}
                addToDone={addToDone}
                removeFromDone={removeFromDone}
                deleteTodoItem={deleteTodoItem}
              />
            }
          />
          <Route
            path="/active"
            element={
              <ActiveTodos
                todos={activeTodos}
                isDone={isDone}
                addToDone={addToDone}
                removeFromDone={removeFromDone}
                deleteTodoItem={deleteTodoItem}
              />
            }
          />
          <Route
            path="/completed"
            element={
              <CompletedTodos
                todos={completedTodos}
                isDone={isDone}
                addToDone={addToDone}
                removeFromDone={removeFromDone}
                deleteTodoItem={deleteTodoItem}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Landing;
