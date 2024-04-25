var express = require('express');
var router = express.Router();
const { saveCustomerToMongoDB, saveNewCustomer} = require('../controllers/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const emailInUse = req.query.emailInUse;
  res.render('createAccount', { emailInUse });
});
router.post("/", async(req, res) => {
  try {
    console.log("Form data received:");

    await saveNewCustomer(req, res);

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
