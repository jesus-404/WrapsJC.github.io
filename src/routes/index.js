const express = require('express');
const router = express.Router();

// To process data sent in on request
const bodyParser = require('body-parser');
const path = require('path'); //to work with separtors on any OS including Windows
const querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// Database
const controllerDatabase = require('../controllers/database');   //this will load the controller file below
router.post("/saveNewUser", controllerDatabase.saveNewUser); //see controllers/database.js file

module.exports = router;
