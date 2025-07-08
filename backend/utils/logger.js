const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },       // e.g., 'created', 'updated'
  taskTitle: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Define the model
const Action = mongoose.model("Action", actionSchema);

/**
 * Log user action on a task (create, update, delete)
 * @param {String} userId - ID of the user who performed the action
 * @param {String} action - Action type ('created', 'updated', 'deleted')
 * @param {String} taskTitle - Title of the task involved
 */
const logAction = async (userId, action, taskTitle) => {
  try {
    await new Action({ user: userId, action, taskTitle }).save();
  } catch (err) {
    console.error("❌ Failed to log action:", err.message);
  }
};

module.exports = logAction;
