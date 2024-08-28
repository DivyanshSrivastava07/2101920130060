const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to fetch products from an e-commerce company's API
const fetchProducts = async (companyName, categoryName, minPrice, maxPrice) => {
    try {
        const response = await axios.get(`http://29.244.55.144/test/companies/${companyName}/categories/${categoryName}/products/topPrice-${minPrice}-${maxPrice}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching products from ${companyName}:`, error.message);
        return [];
    }
};

// GET route to fetch top N products in a category
router.get('/categories/:categoryName/products', async (req, res) => {
    const { categoryName } = req.params;
    const { n = 10, minPrice = 0, maxPrice = Infinity, sortBy, order = 'asc' } = req.query;

    try {
        // Updated companies array
        const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
        const allProducts = await Promise.all(companies.map(company => fetchProducts(company, categoryName, minPrice, maxPrice)));

        // Flatten the results
        let products = allProducts.flat();

        // Sort products if necessary
        if (sortBy) {
            products.sort((a, b) => {
                if (order === 'asc') return a[sortBy] - b[sortBy];
                return b[sortBy] - a[sortBy];
            });
        }

        // Pagination logic
        const page = parseInt(req.query.page) || 1;
        const paginatedProducts = products.slice((page - 1) * n, page * n);

        res.json(paginatedProducts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
});

// GET route to fetch details of a specific product
router.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const { productId } = req.params;
    res.json({ message: `Details for product ${productId}` });
});

module.exports = router;
