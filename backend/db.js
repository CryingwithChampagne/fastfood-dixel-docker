// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // เชื่อมต่อ MongoDB (ปรับตาม docker / atlas)
    const conn = await mongoose.connect("mongodb://localhost:27017/fastfood", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
