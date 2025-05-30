import React, { useState, useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [viewCompleted, setViewCompleted] = useState(false);
  const [taskTime, setTaskTime] = useState("");

  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    return `${hour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    let h = parseInt(hour, 10);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const hStr = h.toString().padStart(2, "0");
    setTaskTime(`${hStr}:${minute}`);
  }, [hour, minute, ampm]);

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

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    if (priority === "") {
      setErrorMsg("Please select a priority before adding a task.");
      return;
    }

    const newTask = {
      id: Date.now(), // add this line
      text: newTodo,
      description: description,
      completed: false,
      date: new Date().toLocaleString(),
      time: taskTime,
      priority: priority,
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
    setDescription("");
    setPriority("");
    setErrorMsg("");
    // Reset time inputs to default
    setHour("12");
    setMinute("00");
    setAmpm("AM");
  };

  const toggleComplete = (id) => {
    const updated = todos.map((todo) => {
      if (todo.id === id) {
        if (!todo.completed) {
          return {
            ...todo,
            completed: true,
            completedDate: new Date().toLocaleString(),
          };
        } else {
          const { completedDate, ...rest } = todo;
          return { ...rest, completed: false };
        }
      }
      return todo;
    });
    setTodos(updated);
  };


  const handleDelete = (id) => {
    const filtered = todos.filter((todo) => todo.id !== id);
    setTodos(filtered);
  };

  const TaskItem = ({ todo }) => (
    <div
      onClick={() => toggleComplete(todo.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleComplete(todo.id);
        }
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        cursor: "pointer",
      }}
    >
      <div>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => {
            e.stopPropagation();
            toggleComplete(todo.id);
          }}
          style={{ transform: "scale(1.4)", marginRight: "8px" }}
        />
        <strong style={{ marginLeft: "8px" }}>
          {todo.text}{" "}
          <span
            style={{
              color:
                todo.priority === "Urgent"
                  ? "red"
                  : todo.priority === "Important"
                    ? "orange"
                    : "gray",
              fontSize: "14px",
              fontWeight: "normal",
            }}
          >
            ({todo.priority})
          </span>
        </strong>
        <br />
        <em>{todo.description}</em>
        <br />
        <small>Time: {formatTime12Hour(todo.time) || "Not specified"}</small>
        <br />
        <small>Added: {todo.date}</small>
        <br />
        {todo.completed && (
          <>
            <small style={{ color: "green" }}>✅ Completed</small>
            <br />
            {todo.completedDate && (
              <small style={{ color: "gray" }}>
                Completed at: {todo.completedDate}
              </small>
            )}
          </>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(todo.id); // ✅ Pass the todo.id
        }}
        style={{
          marginLeft: "10px",
          color: "red",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "transparent",
          border: "2px solid red",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          padding: "4px 8px",
          height: "fit-content",
        }}
      >
        <span style={{ fontSize: "16px" }}>❌</span>
        Delete
      </button>
    </div>
  );


  return (
    <div
      className="todo-container"
      style={{ fontFamily: "Poppins, sans-serif", padding: "20px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ display: "flex", alignItems: "center", margin: 0 }}>
          <img
            src="/todo.png"
            alt="icon"
            style={{ width: "48px", height: "48px", marginRight: "8px" }}
          />
          To-do List
        </h2>
      </div>

      {errorMsg && (
        <div
          style={{
            color: "#b22222",
            fontWeight: "bold",
            marginBottom: "12px",
            fontSize: "14px",
          }}
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <div className="input-area">
        <form onSubmit={handleAddTodo}>
          <label
            style={{ fontWeight: "400", display: "block", marginBottom: "5px" }}
          >
            Significance:
          </label>
          <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
            {["Urgent", "Important", "Optional"].map((level) => {
              const emojis = {
                Urgent: "🔴",
                Important: "🟡",
                Optional: "⚪",
              };
              const isSelected = priority === level;

              return (
                <div
                  key={level}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setPriority(level);
                      setErrorMsg("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "20px",
                      opacity: isSelected ? 1 : 0.5,
                      transform: isSelected ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.2s, opacity 0.2s",
                    }}
                    aria-label={`Set priority to ${level}`}
                  >
                    {emojis[level]}
                  </button>
                  <span style={{ fontSize: "12px", marginTop: "4px" }}>
                    {level}
                  </span>
                </div>
              );
            })}
          </div>

          <label htmlFor="taskTitle" className="font-weight: 800;">
            Task Subject:
          </label>
          <br />
          <input
            id="taskTitle"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter task subject"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <br />

          <div>
            <label
              htmlFor="taskTime"
              style={{ marginTop: "10px", display: "block" }}
            >
              Task Time:
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              {/* Hour selector */}
              <select
                id="hour"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                aria-label="Select hour"
                style={{ padding: "6px" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                  const val = h < 10 ? `0${h}` : `${h}`;
                  return (
                    <option key={val} value={val}>
                      {h}
                    </option>
                  );
                })}
              </select>

              <span style={{ alignSelf: "center" }}>:</span>

              {/* Minute selector */}
              <select
                id="minute"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                aria-label="Select minutes"
                style={{ padding: "6px" }}
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* AM/PM selector */}
              <select
                id="ampm"
                value={ampm}
                onChange={(e) => setAmpm(e.target.value)}
                aria-label="Select AM or PM"
                style={{ padding: "6px" }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <label
            htmlFor="taskDesc"
            className="font-weight: 800;"
            style={{ marginTop: "10px" }}
          >
            Task Description:
          </label>
          <br />
          <textarea
            id="taskDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddTodo(e);
              }
            }}
            placeholder="Enter task description"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
              </svg>
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Sticky tab header - move this outside the scrollable area */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "10px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#b4c3cc",
          padding: "10px 0",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div
          onClick={() => setViewCompleted(false)}
          style={{
            padding: "5px",
            cursor: "pointer",
            textDecoration: !viewCompleted ? "underline" : "none",
            fontWeight: !viewCompleted ? "bold" : "normal",
            width: "fit-content",
            minWidth: "150px",
            textAlign: "center",
          }}
        >
          Pending Tasks
        </div>
        <div
          onClick={() => setViewCompleted(true)}
          style={{
            padding: "5px",
            cursor: "pointer",
            textDecoration: viewCompleted ? "underline" : "none",
            fontWeight: viewCompleted ? "bold" : "normal",
            width: "fit-content",
            minWidth: "150px",
            textAlign: "center",
          }}
        >
          Completed Tasks
        </div>
      </div>

      {/* Scrollable todo list - leave this below */}
      <div
        className="todo-list-scroll"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          marginTop: "0",
          paddingTop: "10px",
        }}
      >
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {todos
            .filter((todo) => todo.completed === viewCompleted)
            .map((todo, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <TaskItem todo={todo} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
