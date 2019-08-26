const express = require('express');
const router = express.Router();
const db = require('../sequelize')
const Stats = require('../controller/stats')
router.get('/', Stats.getStats);

module.exports = router;
