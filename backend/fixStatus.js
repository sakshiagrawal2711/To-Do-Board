const mongoose = require("mongoose");
const Task = require("./models/Task"); // adjust path if needed
require("dotenv").config(); // if using .env for MongoDB URI

// Connect to your MongoDB Atlas DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Connected to MongoDB");

  // Find and update all tasks with lowercase "todo"
  const result = await Task.updateMany(
    { status: "todo" },
    { $set: { status: "Todo" } }
  );

  console.log("Documents updated:", result.modifiedCount);

  mongoose.disconnect();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
