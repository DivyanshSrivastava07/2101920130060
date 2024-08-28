const express = require("express");
const axios = require("axios");
const router = express.Router();

// List of valid categories
const categories = [
  "Phone",
  "Computer",
  "TV",
  "Earphone",
  "Tablet",
  "Charger",
  "Mouse",
  "Keypad",
  "Bluetooth",
  "Pendrive",
  "Remote",
  "Speaker",
  "Headset",
  "Laptop",
  "PC",
];

// Middleware to check if category is valid
const validateCategory = (req, res, next) => {
  const { categoryName } = req.params;
  if (categories.includes(categoryName)) {
    next();
  } else {
    res.status(400).json({ message: "Invalid category name" });
  }
};

// Route to get top products
router.get(
  "/categories/:categoryName/products",
  validateCategory,
  async (req, res) => {
    const { categoryName } = req.params;
    const {
      top = 10,
      minPrice = 0,
      maxPrice = 10000,
      page = 1,
      sort = "rating",
      order = "desc",
    } = req.query;

    // Validate query parameters
    if (isNaN(top) || isNaN(minPrice) || isNaN(maxPrice) || isNaN(page)) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0ODI5NDYwLCJpYXQiOjE3MjQ4MjkxNjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjVjOWJiNmM5LWRhYjAtNDQ1Yy1iMDQwLWMzOTE0ZWFmYzI2MCIsInN1YiI6Iml0ZncyMTAwNUBnbGJpdG0uYWMuaW4ifSwiY29tcGFueU5hbWUiOiJBZmZvcmRtZWQiLCJjbGllbnRJRCI6IjVjOWJiNmM5LWRhYjAtNDQ1Yy1iMDQwLWMzOTE0ZWFmYzI2MCIsImNsaWVudFNlY3JldCI6Im9jTGFXQ3ZqSkR1TFN6VHAiLCJvd25lck5hbWUiOiJEaXZ5YW5zaCIsIm93bmVyRW1haWwiOiJpdGZ3MjEwMDVAZ2xiaXRtLmFjLmluIiwicm9sbE5vIjoiMjEwMTkyMDEzMDA2MCJ9.BIT9OYEk4_Dk1V-KfyFbAYBHwAVAXO1i_S_WI6r50BM";
        try {
      const response = await axios.get(
        `http://20.244.56.144/test/companies/AMZ/categories/${categoryName}/products`,
        {
          params: {
            top,
            minPrice,
            maxPrice,
            page,
            sort,
            order,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let products = response.data.products;

      // Sort products based on query parameter
      if (sort === "price") {
        products.sort((a, b) =>
          order === "asc" ? a.price - b.price : b.price - a.price
        );
      } else if (sort === "rating") {
        products.sort((a, b) =>
          order === "asc" ? a.rating - b.rating : b.rating - a.rating
        );
      } else if (sort === "discount") {
        products.sort((a, b) =>
          order === "asc" ? a.discount - b.discount : b.discount - a.discount
        );
      }

      // Generate unique IDs for products
      products = products.map((product, index) => ({
        id: `${categoryName}-${index}-${Date.now()}`,
        ...product,
      }));

      res.json(products);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Error fetching products");
    }
  }
);

// Route to get a specific product
router.get(
  "/categories/:categoryName/products/:productId",
  validateCategory,
  async (req, res) => {
    const { categoryName, productId } = req.params;

    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0ODI5NDYwLCJpYXQiOjE3MjQ4MjkxNjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjVjOWJiNmM5LWRhYjAtNDQ1Yy1iMDQwLWMzOTE0ZWFmYzI2MCIsInN1YiI6Iml0ZncyMTAwNUBnbGJpdG0uYWMuaW4ifSwiY29tcGFueU5hbWUiOiJBZmZvcmRtZWQiLCJjbGllbnRJRCI6IjVjOWJiNmM5LWRhYjAtNDQ1Yy1iMDQwLWMzOTE0ZWFmYzI2MCIsImNsaWVudFNlY3JldCI6Im9jTGFXQ3ZqSkR1TFN6VHAiLCJvd25lck5hbWUiOiJEaXZ5YW5zaCIsIm93bmVyRW1haWwiOiJpdGZ3MjEwMDVAZ2xiaXRtLmFjLmluIiwicm9sbE5vIjoiMjEwMTkyMDEzMDA2MCJ9.BIT9OYEk4_Dk1V-KfyFbAYBHwAVAXO1i_S_WI6r50BM";
    try {
      const response = await axios.get(
        `http://20.244.56.144/test/companies/AMZ/categories/${categoryName}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "Error fetching product details:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Error fetching product details");
    }
  }
);

module.exports = router;
