const express = require('express');
const router = express.Router();
const { getProducts } = require("../controllers/database");

router.get('/', async function (req, res, next) {
  const products = await getProducts(req, res, next); // Get product array from db
  res.render('products', { products }); // Render 'products.ejs' with the data
});

module.exports = router;
