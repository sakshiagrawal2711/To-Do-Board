const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssign
} = require('../controllers/taskController');
const { smartAssignTask } = require('../controllers/smartAssignController');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (io) => {
  const router = express.Router();

  // Inject io instance into each request
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Protect all routes
  router.use(authMiddleware);

  // CRUD Routes
  router.get('/', getTasks);                   // ✅ Get all tasks
  router.post('/', createTask);                // ✅ Create a task
  router.put('/:id', updateTask);              // ✅ Update task with conflict handling
  router.delete('/:id', deleteTask);           // ✅ Delete a task

  // Smart Assign Route
  router.post('/:id/smart-assign', smartAssignTask); // ✅ Smart assign to a user

  return router;
};
