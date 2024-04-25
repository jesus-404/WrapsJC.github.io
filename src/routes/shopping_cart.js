const express = require('express');
const router = express.Router();
const Cart = require('../models/cart')

router.get('/', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shopping_cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('shopping_cart', { products: cart.toArray(), totalPrice: cart.totalPrice });
});


module.exports = router;
