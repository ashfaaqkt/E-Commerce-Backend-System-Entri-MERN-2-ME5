const express = require('express');
const { chat, analyzeProduct } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', chat);
router.post('/analyze-product', analyzeProduct);

module.exports = router;
