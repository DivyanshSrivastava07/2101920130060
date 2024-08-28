const express = require('express');
const app = express();
const port = 3000;

// Import the products router
const productsRouter = require('./products.js');

// Middleware to handle errors globally
app.use((err, req, res, next) => {
    console.error('Error Details:', err.message);
    res.status(500).send('Internal Server Error');
});

// Use the products router for API routes
app.use('/api', productsRouter);

// Route for root path
app.get('/', (req, res) => {
    res.send('Welcome to the Top Products API');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
