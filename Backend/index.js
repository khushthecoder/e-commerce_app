require('dotenv').config();
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 20;
const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/productroutes.js');
const authRoutes = require('./src/routes/authroutes.js');
const cartRoutes = require('./src/routes/cartroutes.js');
const orderRoutes = require('./src/routes/orderroutes.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.use('/users', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
