const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  tasksCompleted: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      completedAt: { type: Date, default: Date.now },
      reward: { type: Number, default: 0 } // optional: task reward amount
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
