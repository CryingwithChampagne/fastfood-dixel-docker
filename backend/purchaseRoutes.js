// routes/purchaseRoutes.js
import express from "express";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// Create a purchase log
router.post("/", async (req, res) => {
  try {
    const { userId, items, paymentMethod } = req.body;

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const purchase = new Purchase({
      userId,
      items,
      totalAmount,
      paymentMethod
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all purchases of a user
router.get("/:userId", async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.params.userId }).populate("items.menuId");
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
