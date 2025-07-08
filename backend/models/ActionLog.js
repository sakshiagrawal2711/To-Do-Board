const mongoose = require("mongoose");

const actionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  action: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActionLog", actionLogSchema);
