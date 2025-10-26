const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "User" }, // add this
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  tasksCompleted: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      completedAt: { type: Date, default: Date.now },
      reward: { type: Number, default: 0 }
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
