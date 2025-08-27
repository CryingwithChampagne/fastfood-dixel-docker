import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/fastfood';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Schemas
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const orderSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Menu = mongoose.model('Menu', menuSchema);
const Order = mongoose.model('Order', orderSchema);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get menu
app.get('/menu', async (_req, res) => {
  const menu = await Menu.find().lean();
  res.json(menu);
});

// Place order with validation and total
app.post('/order', async (req, res) => {
  const { item, quantity } = req.body || {};

  if (!item || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Valid item and quantity required' });
  }

  const menuItem = await Menu.findOne({ name: item });
  if (!menuItem) {
    return res.status(404).json({ error: `Item '${item}' not found in menu` });
  }

  const total = menuItem.price * quantity;
  const order = await Order.create({ item, quantity, total });

  res.status(201).json({
    message: `You ordered ${quantity} x ${item}`,
    order
  });
});

// Get all orders
app.get('/orders', async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  res.json(orders);
});

async function seedMenu() {
  const count = await Menu.countDocuments();
  if (count === 0) {
    await Menu.insertMany([
      { name: 'Burger', price: 5.99 },
      { name: 'Fries', price: 2.99 },
      { name: 'Pizza', price: 8.49 },
      { name: 'Soda', price: 1.50 },
      { name: 'Chicken Nuggets', price: 4.50 }
    ]);
    console.log('Menu seeded');
  }
}

async function start() {
  try {
    await mongoose.connect(MONGO_URL, { dbName: 'fastfood' });
    console.log('Connected to MongoDB');
    await seedMenu();
    app.listen(PORT, () => console.log(`FastFood API running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
