const express = require('express');
const router = express.Router();
const Cart = require('../models/cart')

router.get('/', function(req, res, next) {
  res.render('shopping_cart');
});


module.exports = router;
