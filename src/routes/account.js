var express = require('express');
const { customerLogin } = require("../controllers/database");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const loginPrompt = req.query.loginPrompt;
  const loginFailed = req.query.loginFailed;
  const loginSuccess = req.query.loginSuccess;
  const loginEmail = req.query.loginEmail;
  res.render('account', { loginPrompt, loginFailed, loginSuccess, loginEmail});
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
