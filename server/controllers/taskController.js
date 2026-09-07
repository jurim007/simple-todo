// server/controllers/taskController.js
const { Task } = require("../models");

// CREATE — POST /
async function createTask(req, res) {
  try {
    const task = await Task.create(req.body); // req.body = { title, description, completed }
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message }); // e.g. title missing -> allowNull:false rejects it
  }
}

// READ ALL — GET /
async function getAllTasks(req, res) {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// READ ONE — GET /:id
async function getTaskById(req, res) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE — PUT /:id
async function updateTask(req, res) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await task.update(req.body); // only overwrites fields present in req.body
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE — DELETE /:id
async function deleteTask(req, res) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await task.destroy();
    res.status(204).send(); // 204 = success, no body to return
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
