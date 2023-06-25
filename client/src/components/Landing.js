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
  const [doneTodos, setDoneTodos] =useState()
  const [lang, setLang] = useState(true);



  const [todosList, setTodosList] = useState([]);
  const [allTodosList, setAllTodo] = useState([]);
  const [completedTodo, setCompletedTodo] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
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

 
    const getCompletedTodoList = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:8080/todos/done/ids/${userId}`
        );
        setDoneTodos(response.data.done);
        

      } catch (err) {
        console.log(err);
      }
    };
        
   
    getCompletedTodoList();
    getTodoList();

  }, [todo]);

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
    console.log('toggel');
  };

  const toggelLang = (e) => {
    e.preventDefault();
    setLang(!lang);
  };

const removeFromDone = async (todoId) => {
  try {
    await axios.delete(`http://localhost:8080/todos/done/${userId}/${todoId}`);
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

  const AllListHandler = () => {
    setTodosList(allTodosList);
  };
  const activeListHandler = () => {
    setTodosList(activeTodos);
  };
  const compListHandler = () => {
    setTodosList(doneTodos);
  };

  const addToDone = async (todoId) => {
    try {
      await axios.put("http://localhost:8080/todos", {
        todoId,
        userId,
      });
      //////ADD TO COMP
      setCompletedTodo((prevCompletedTodo) => [...prevCompletedTodo, todoId]);
      console.log("Todo marked as done");
    } catch (error) {
      console.log(error);
    }
  };


const isDone = (id)=> doneTodos.includes(id)
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

  return (
    <div className={isDarkMode ? "dark-mode main" : "light-mode main"}>
      <div className="main-container">
        <Navbar modeToggel={toggelMode} />
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
                })}
              </ul>
            </div>
            <div className="todo-footer-links">
              <span>{activeTodos.length} items left</span>
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
