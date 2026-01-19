require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const agoraRoutes = require('./routes/agora_routes');
const avatarRoutes = require('./routes/avatar_routes');
const aiSummaryRoutes = require('./routes/aiSummary_routes');
const settingsRoutes = require('./routes/settings_routes');
const basicAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint (no auth required for monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Apply Basic Authentication to all routes below
app.use(basicAuth);

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/src', express.static(path.join(__dirname, '../src')));
app.use('/lib', express.static(path.join(__dirname, '../node_modules'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/api/agora', agoraRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/ai-summary', aiSummaryRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});

module.exports = app;