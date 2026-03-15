const express = require('express');
const router = express.Router();
const { getResources } = require('../controllers/resources.controller');

router.route('/').get(getResources);

module.exports = router;
