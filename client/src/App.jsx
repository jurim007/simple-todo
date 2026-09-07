import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return; // don't submit empty titles
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTasks(); // re-fetch so the new task shows up
  }

  async function handleToggle(task) {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  }

  async function handleDelete(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  }

  return (
    <div className="container mt-5">
      <h1>To-Do List</h1>
      <form onSubmit={handleAdd} className="d-flex mb-3">
        <input
          className="form-control me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span
              onClick={() => handleToggle(task)}
              style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
            >
              {task.title}
            </span>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;