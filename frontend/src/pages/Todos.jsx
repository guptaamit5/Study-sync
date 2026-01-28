import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/workspace.css";

export default function Todos() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch {
      alert("Failed to load todos");
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: task.trim() }),
      });

      if (!res.ok) throw new Error();

      const todo = await res.json();
      setTodos(prev => [todo, ...prev]);
      setTask("");
    } catch {
      alert("Failed to add task");
    }
  };

  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/todos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      // 🔥 DB is source of truth
      fetchTodos();
    } catch {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="workspace">
      <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="page-divider" />

      <div className="workspace-header">
        <h1>My Todos</h1>
        <button className="primary-btn" onClick={addTodo}>
          + Add Task
        </button>
      </div>

      <input
        className="todo-input"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Enter a task..."
      />

      <div className="todo-divider" />

      <div className="card-grid">
        {todos.map(todo => (
          <div className="card todo-card" key={todo._id}>
            <h3>{todo.title}</h3>

            <button
              className="secondary-btn"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </div>
        ))}

        {todos.length === 0 && <p>No tasks yet.</p>}
      </div>
    </div>
  );
}
