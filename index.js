const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import and use the products routes
const productsRoutes = require('./routes/products');
app.use('/api', productsRoutes);

// Default Route for Testing
app.get('/', (req, res) => {
    res.send('Top Products Microservice is running!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
