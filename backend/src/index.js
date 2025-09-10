const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const { Sequelize } = require('sequelize');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/story');
const { initSocket } = require('./sockets/collaborate');
require('./models');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3001'],
  credentials: true, // if you need cookies/tokens
}));

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    // origin: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost' 
    origin: ['http://localhost:3000', 'https://localhost:3001']
  } 
});

// Database setup
const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

// Middleware
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

// Socket.io for real-time collaboration
initSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});