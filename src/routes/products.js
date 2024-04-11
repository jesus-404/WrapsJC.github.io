var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let name = 'High Glossy Paint Black Vinyl Wrap';
  let price = '40.00';
  res.render('products', { name: name, price: price});
});

module.exports = router;
