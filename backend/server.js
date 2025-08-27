// server.js
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import Order from "./models/Order.js";
import purchaseRoutes from "../backend/models/Purchase.js";

const app = express();
app.use(bodyParser.json());

// ✅ เชื่อมต่อ MongoDB
connectDB();

// ✅ Route สำหรับสร้าง order
app.post("/order", async (req, res) => {
  try {
    const { item, quantity, price, paymentMethod } = req.body;
    if (!item || !quantity || !price || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const order = new Order({ item, quantity, price, paymentMethod });
    await order.save();
    res.status(201).json({ message: "Order saved!", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route สำหรับดึง order ทั้งหมด
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use("/api/purchases", purchaseRoutes);
