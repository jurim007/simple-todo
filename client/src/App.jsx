import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TASKS_URL = "http://localhost:3000/api/tasks";
const USERS_URL = "http://localhost:3000/api/users";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddUser, setShowAddUser] = useState(false); // controls whether the mini "new user" form is visible
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchTasks();
    }
  }, [selectedUserId]);

  async function fetchTasks() {
    const res = await fetch(`${TASKS_URL}?userId=${selectedUserId}`);
    const data = await res.json();
    setTasks(data);
  }

  async function fetchUsers() {
    const res = await fetch(USERS_URL);
    const data = await res.json();
    setUsers(data);
    if (data.length > 0 && !selectedUserId) {
      setSelectedUserId(data[0].id); // default to the first user once loaded
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim() || !selectedUserId) return;
    const res = await fetch(TASKS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId: selectedUserId }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to add task:", err.error);
      return;
    }
    setTitle("");
    fetchTasks();
  }

  async function handleToggle(task) {
    await fetch(`${TASKS_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  }

  async function handleDelete(id) {
    await fetch(`${TASKS_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const res = await fetch(USERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName, email: newUserEmail }),
    });
    const created = await res.json();
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUser(false);
    await fetchUsers();
    setSelectedUserId(created.id); // auto-select the user you just created
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>To-Do List</h1>

        {/* User selector corner widget */}
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowAddUser(!showAddUser)}
          >
            +
          </button>
        </div>
      </div>

      {/* Inline "new user" form, only rendered when showAddUser is true */}
      {showAddUser && (
        <form onSubmit={handleCreateUser} className="d-flex gap-2 mb-4">
          <input
            className="form-control"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            Create
          </button>
        </form>
      )}

      <form onSubmit={handleAdd} className="d-flex mb-3">
        <input
          className="form-control me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span
              onClick={() => handleToggle(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
