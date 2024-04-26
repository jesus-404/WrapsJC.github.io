const express = require('express');
const Cart = require("../models/cart");
const { placeOrder } = require("../controllers/database");
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shopping_cart', { products: null, totalPrice: 0 });
  }
  const cart = new Cart(req.session.cart);
  res.render('shopping_checkout', { totalPrice: cart.totalPrice});
});

router.post("/", async(req, res) => {
  if (!req.session.cart || req.session.cart.totalQuantity === 0) {
    return res.render('shopping_cart', { products: null, totalPrice: 0 });
  }
  try {

    await placeOrder(req, res);

  } catch (error) {
    console.error("Error placing order: " + error);
    res.status(500).send("Error placing order: " + error);
  }
});

module.exports = router;
