import React from "react";

const CompletedTodos = ({ todos }) => {
  return (
    <div>
      <h1>Completed Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTodos;
