const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const chatRoutes = require('./routes/chat.routes');
const reviewRoutes = require('./routes/review.routes');
const menuRoutes = require('./routes/menu.routes');
const cartRoutes = require('./routes/cart.routes');
const reservationRoutes = require('./routes/reservation.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Selain FRONTEND_URL (alias stabil), izinin juga semua URL deployment
// Vercel buat project frontend ini (tiap `vercel deploy` bikin domain baru,
// misal frontend-xxxxx-<team>.vercel.app), biar CORS gak jebol tiap deploy baru.
const vercelPreviewPattern = /^https:\/\/frontend-[a-z0-9]+-shahky-yandhana-putras-projects\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === config.frontendUrl || vercelPreviewPattern.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin tidak diizinkan oleh CORS'));
    },
  })
);
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);

// Vercel manggil app ini sebagai serverless function (lewat api/index.js),
// jadi app.listen() cuma dipanggil pas dijalanin lokal (bukan di Vercel).
if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`Backend jalan di http://localhost:${config.port}`);
  });
}

module.exports = app;
