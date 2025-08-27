// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    item: String,
    quantity: Number,
    price: Number,
    paymentMethod: String, // Add this line
  },
  { timestamps: true } // This adds createdAt and updatedAt
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
