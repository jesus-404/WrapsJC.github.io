var express = require('express');
var router = express.Router();
const { saveCustomerToMongoDB, saveNewCustomer} = require('../controllers/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('createAccount');
});
router.post("/", async(req, res) => {
  try {
    // Extract data from the form
    console.log("Form data received:");
    //const { email, password, street, city, state, zip, phone } = req.body;

    await saveNewCustomer(req, res);

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
