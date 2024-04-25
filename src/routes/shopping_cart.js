const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let name = 'High gloss paint';
  let price = '40.00';
  let prodID = 1;
  res.render('shopping_cart', {name: name, price: price, prodID: prodID });
});



module.exports = router;
