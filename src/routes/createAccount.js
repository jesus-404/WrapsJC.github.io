var express = require('express');
var router = express.Router();
const { saveCustomerToMongoDB } = require('../controllers/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('createAccount');
});
router.post("/", async(req, res) => {
  try {
    // Extract data from the form
    console.log("Form data received:", req.body);
    const { email, password, street, city, state, zip, phone } = req.body;

    await saveCustomerToMongoDB(req, res, email, password, street, city, state, zip, phone);

    res.status(200);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
