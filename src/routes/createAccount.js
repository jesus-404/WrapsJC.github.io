const express = require('express');
const router = express.Router();
const { saveNewUser} = require('../controllers/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const emailInUse = req.query.emailInUse;
  res.render('createAccount', { emailInUse });
});
router.post("/", async(req, res) => {
  try {
    console.log("Form data received:");

    await saveNewUser(req, res);

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
