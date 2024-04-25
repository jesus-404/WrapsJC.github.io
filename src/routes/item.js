const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let name = 'High Glossy Paint Black Vinyl Wrap';
  let price = '40.00';
  let prodID = req.query.prod;
  res.render('item', { name: name, price: price, prodID: prodID });
});

module.exports = router;
