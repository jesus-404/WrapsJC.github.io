const express = require('express');
const router = express.Router();
const { getProduct } = require("../controllers/database");

router.get('/', async function (req, res, next) {
  const product = await getProduct(req, res, next);
  res.render('item', {product});
});

module.exports = router;
