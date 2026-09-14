// server/contollers/userController.js
const { Task, User } = require('../models');

// CREATE - POST
async function createUser(req, res) {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// READ ALL - GET /
async function getAllUsers(req, res) {
    try {
        const user = await User.findAll({ include: Task});
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// READ ONE - GET /:id
async function getUserById(req, res) {
    try {
        const user = await User.findByPk(req.params.id, { include: Task});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// UPDATE - GET /:id
async function updateUser(req, res) {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update(req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETE - DELETE /:id
async function deleteUser(req, res) {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};