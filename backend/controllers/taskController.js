const Task = require("../models/Task");
const User = require("../models/User");
const logAction = require("../utils/logger");

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id,
    });

    await task.save();

    req.io.emit("taskCreated", task);
    await logAction(req.user.id, "created", task.title);

    req.io.emit("action-log", {
      user: req.user.username,
      action: "created",
      task: task.title,
      timestamp: Date.now(),
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ msg: "Task creation failed" });
  }
};

// ✅ Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "username");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};

// ✅ Conflict-Aware Task Update
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const clientUpdatedAt = new Date(req.body.lastUpdatedClient);
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const serverUpdatedAt = new Date(existingTask.updatedAt);

    if (clientUpdatedAt < serverUpdatedAt) {
      return res.status(409).json({
        msg: "Conflict detected",
        serverVersion: existingTask,
        clientVersion: req.body,
      });
    }

    const updated = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    }).populate("assignedTo", "username");

    req.io.emit("taskUpdated", updated);
    await logAction(req.user.id, "updated", updated.title);

    req.io.emit("action-log", {
      user: req.user.username,
      action: "updated",
      task: updated.title,
      timestamp: Date.now(),
    });

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Task update failed" });
  }
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ msg: "Task not found" });

    req.io.emit("taskDeleted", deleted._id);
    await logAction(req.user.id, "deleted", deleted.title);

    req.io.emit("action-log", {
      user: req.user.username,
      action: "deleted",
      task: deleted.title,
      timestamp: Date.now(),
    });

    res.json({ msg: "Task deleted", id: deleted._id });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Task deletion failed" });
  }
};

// ✅ Smart Assign
exports.smartAssign = async (req, res) => {
  try {
    const taskId = req.params.id;

    const users = await User.find();
    let minUser = null;
    let minCount = Infinity;

    for (const user of users) {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $in: ["Todo", "In Progress"] },
      });

      if (count < minCount) {
        minUser = user;
        minCount = count;
      }
    }

    if (!minUser) return res.status(404).json({ msg: "No users found" });

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: minUser._id },
      { new: true }
    ).populate("assignedTo", "username");

    if (!task) return res.status(404).json({ msg: "Task not found" });

    req.io.emit("taskUpdated", task);

    const actionMsg = `Smart assigned task "${task.title}" to ${minUser.username}`;
    await logAction(req.user.id, "smart-assigned", actionMsg);

    req.io.emit("action-log", {
      user: req.user.username,
      action: "smart-assigned",
      task: task.title,
      to: minUser.username,
      timestamp: Date.now(),
    });

    res.json({ task, assignedTo: minUser.username });
  } catch (err) {
    console.error("Smart assign failed:", err);
    res.status(500).json({ msg: "Smart assign failed" });
  }
};
