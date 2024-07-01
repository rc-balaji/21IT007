const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Read data from the JSON file
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const validToken = "12345";

  if (token === validToken) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

// API endpoint with authentication middleware
app.get(
  "/test/companies/:company/categories/:category/products",
  authenticateToken,
  (req, res) => {
    const { company, category } = req.params;
    const { top, minPrice, maxPrice } = req.query;

    // console.log(data);
    const filteredData = data.filter(
      (item) =>
        item.company === company &&
        item.category === category &&
        item.price >= minPrice &&
        item.price <= maxPrice
    );

    // console.log(filteredData);

    res.json(filteredData.slice(0, top));
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
