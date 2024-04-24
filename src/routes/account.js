var express = require('express');
const { customerLogin } = require("../controllers/database");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('account');
});
router.post("/", async(req, res) => {
  try {
    // Extract data from the form
    console.log("Form data received:", req.body);

    await customerLogin(req, res);

  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).send("Error logging in: " + error);
  }
});

module.exports = router;
