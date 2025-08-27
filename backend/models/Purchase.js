// models/Purchase.js
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // unit price
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "credit_card", "paypal"], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Purchase", purchaseSchema);
