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
  const userId = window.localStorage.getItem('userId')
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState(true);
  const [todosList, setTodosList] = useState([]);
  const navigate = useNavigate();
 const [todo, setTodo] = useState({
    text:'',
    state:false,
    userOwner:userId
  })
/////////////////////

/////////////////////  
const getTodoList = async()=>{
  try {
   await axios.get("http://localhost:8080/todos")
    .then((resp) => setTodosList(resp.data))
  } catch (error) {
    console.error(error);
  }
}

  const changeHandler =(e)=>{
    e.preventDefault()
    const {name, value} = e.target
    setTodo({...todo,[name]:value})
    console.log(todo);
  }

  const addTodo =async(e)=>{
    e.preventDefault()
    try {
      await axios.post("http://localhost:8080/todos",todo)
      alert('todo added successfully')
    } catch (error) {
      console.log(error);
    }
  }

  const toggelMode = (e) => {
    e.preventDefault();
    setIsDarkMode(!isDarkMode);
  };
  const toggelLang = (e) => {
    e.preventDefault();
    setLang(!lang);
  };

useEffect(() => {
  getTodoList();
}, []);
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
         navigate('/login')
        ) : (
          <div className="todos-main">
            <div className="add-todo">
              <label className="checkbox-container">
                <input type="checkbox" checked={false} />
                <span className="checkmark"></span>
              </label>
              <form className="list-item" onBlur={addTodo}>
                <label htmlFor="text"></label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  onChange={changeHandler}
                />
              </form>
            </div>
            <div className="todo-list">
              <ul className="todo-ul">
                {todosList.map((todo) => {
                  return (
                    <div className="list-item">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={todo.state}
                          onClick={() => {
                            return console.log(todo.state);
                          }}
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
