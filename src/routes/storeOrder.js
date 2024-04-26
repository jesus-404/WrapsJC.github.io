const express = require('express');
const { getOrder } = require("../controllers/database");
const router = express.Router();

router.get('/:id', async function (req, res, next) {
    try {
        await getOrder(req, res);
    } catch {
        return res.redirect('index');
    }
});

module.exports = router;