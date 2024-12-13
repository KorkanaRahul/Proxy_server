const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
    console.log([${new Date().toISOString()}] ${req.method} ${req.url});
    next();
});

// Proxy middleware to forward requests to the target server
app.use(
    '/api', // Prefix for the proxy route
    createProxyMiddleware({
        target: process.env.TARGET_SERVER, // Use environment variable for the target server
        changeOrigin: true, // Needed to handle CORS
        pathRewrite: {
            '^/api': '', // Remove the '/api' prefix when forwarding the request
        },
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
