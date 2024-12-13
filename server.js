const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;
const TARGET_SERVER = process.env.TARGET_SERVER || 'http://164.100.140.208:5001';

// Middleware for logging requests
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
});

// Proxy middleware to forward requests to the target server
app.use(
    '/api', // Prefix for proxy routes
    createProxyMiddleware({
        target: TARGET_SERVER,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '', // Remove /api prefix when forwarding
        },
        onError(err, req, res) {
            console.error('Proxy error:', err);
            res.status(500).json({ error: 'Proxy error. Please try again later.' });
        },
    })
);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Proxy server is running.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
    console.log(`Forwarding requests to: ${TARGET_SERVER}`);
});
