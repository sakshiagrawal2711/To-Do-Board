const Task = require("../models/Task");
const User = require("../models/User");

const smartAssignTask = async (req, res) => {
  try {
    console.log("🔥 Smart Assign Triggered by user:", req.user);

    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found for assignment." });
    }

    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({ assignedTo: user._id });
        return { user, count };
      })
    );

    console.log("📊 User task counts:", userTaskCounts);

    const leastBusyUser = userTaskCounts.reduce((min, curr) =>
      curr.count < min.count ? curr : min
    ).user;

    console.log("✅ Least busy user selected:", leastBusyUser);

    // ✅ Update and Save task
    task.assignedTo = leastBusyUser._id;
    await task.save();

    // ✅ Populate the assignedTo field
    const populatedTask = await Task.findById(task._id).populate("assignedTo");

    // 🔁 Emit update to all clients
    req.io?.emit("taskUpdated", populatedTask);

    // ✅ Respond with full task including assigned user
    res.status(200).json({
      message: "Task smart-assigned successfully",
      task: populatedTask,
    });
  } catch (err) {
    console.error("❌ Smart Assign Error:", err.stack);
    res.status(500).json({ message: "Failed to smart assign task" });
  }
};

module.exports = { smartAssignTask };
