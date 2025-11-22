import express from 'express';
import cors from 'cors';
import authRoutes from './auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'StreamFlix API is running!',
    status: 'OK'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Test it: http://localhost:${PORT}/`);
});
