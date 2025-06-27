const express = require('express');
const router = express.Router();
const { getNewsOGMeta } = require('../controllers/newsController');

// OG Preview Route
router.get('/og/news/:id', getNewsOGMeta);

module.exports = router;