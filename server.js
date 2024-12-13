const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_SERVER = process.env.TARGET_SERVER || 'http://localhost:5001';

// Middleware for logging requests
app.use((req, res, next) => {
    console.log([${new Date().toISOString()}] ${req.method} ${req.url});
    next();
});

// Proxy middleware
app.use(
    '/api',
    createProxyMiddleware({
        target: TARGET_SERVER,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Remove "/api" prefix from forwarded requests
    })
);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Proxy server is running.');
});

// Start the server
app.listen(PORT, () => {
    console.log(Proxy server is running on http://localhost:${PORT});
});
