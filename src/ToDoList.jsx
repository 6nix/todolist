import React, { useState, useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");

  // Load todos from localStorage on first render
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage", error);
      setTodos([]);
    }
  }, []);

  // Save todos to localStorage when todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const newTask = {
      text: newTodo,
      description: description,
      completed: false,
      date: new Date().toLocaleString(),
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
    setDescription("");
  };

  const toggleComplete = (index) => {
    const updated = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  const handleDelete = (index) => {
    const filtered = todos.filter((_, i) => i !== index);
    setTodos(filtered);
  };

  return (
    <div
      className="todo-container"
      style={{ fontFamily: "Poppins, sans-serif", padding: "20px" }}
    >
      <h2 style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/todo.png"
          alt="icon"
          style={{ width: "48px", height: "48px", marginRight: "8px" }}
        />
        To-do List
      </h2>

      <div className="input-area">
        <form onSubmit={handleAddTodo}>
          <label htmlFor="taskTitle" className="font-weight: 800;">Task Subject:</label>
          <br />
          <input
            id="taskTitle"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter task subject"
            style={{ width: "400px", height: "40px" }}
          />
          <br />

          <label htmlFor="taskDesc" className="font-weight: 800;" style={{ marginTop: "10px" }}>
            Task Description:
          </label>
          <br />
          <textarea
            id="taskDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            style={{
              width: "400px",
              height: "80px",
              resize: "none",
              marginTop: "5px",
            }}
          />
          <br />

          <button type="submit" style={{ marginTop: "10px" }}>
            Add
          </button>
        </form>
      </div>

      <div
        className="todo-list-scroll"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          marginTop: "20px",
          borderTop: "1px solid #ccc",
          paddingTop: "10px",
        }}
      >
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {todos.map((todo, index) => (
            <li key={index} style={{ marginBottom: "20px" }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(index)}
              />
              <strong style={{ marginLeft: "8px" }}>{todo.text}</strong>
              <br />
              <em>{todo.description}</em>
              <br />
              <small>Added: {todo.date}</small>
              <br />
              {todo.completed && (
                <small style={{ color: "green" }}>✅ Completed</small>
              )}
              <br />
              <button
                onClick={() => handleDelete(index)}
                style={{ marginTop: "5px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
