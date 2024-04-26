const express = require('express');
const router = express.Router();
const { addToCart } = require("../controllers/database");

// To process data sent in on request
const bodyParser = require('body-parser');
const path = require('path'); //to work with separtors on any OS including Windows
const querystring = require('querystring');
const Cart = require("../models/cart"); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/addToCart/:id', async function (req, res, next) {
  await addToCart(req, res, next);
});

router.get('/reduce/:id', function (req, res, next) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  const productID = req.params.id;
  cart.reduceByOne(productID);
  req.session.cart = cart;
  res.redirect('/shopping_cart');
});

router.get('/remove/:id', function (req, res, next) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  const productID = req.params.id;
  cart.remove(productID);
  req.session.cart = cart;
  res.redirect('/shopping_cart');
});

module.exports = router;
