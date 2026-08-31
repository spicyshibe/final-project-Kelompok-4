const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const chatRoutes = require('./routes/chat.routes');
const reviewRoutes = require('./routes/review.routes');
const menuRoutes = require('./routes/menu.routes');
const cartRoutes = require('./routes/cart.routes');
const reservationRoutes = require('./routes/reservation.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes); // Updated to /api/health from main
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);

app.listen(config.port, () => {
  console.log(`Backend jalan di http://localhost:${config.port}`);
});
