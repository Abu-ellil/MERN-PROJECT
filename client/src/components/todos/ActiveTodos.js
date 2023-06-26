import React from "react";

const ActiveTodos = ({ todos, isDone,addToDone,removeFromDone,deleteTodoItem }) => {
  return (
    <div className="todos-pages">
      <div className="todo-list">
        <ul className="todo-ul">
          {todos.map((todo) => (
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
          ))}
        </ul>
      </div>
    </div>
  );}

export default ActiveTodos;
