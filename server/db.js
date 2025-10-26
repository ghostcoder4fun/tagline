// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri ="mongodb+srv://taglinedb:0UihVA240prY9aQE@cluster0.sgnifor.mongodb.net/?appName=Cluster0";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

module.exports = connectDB;
