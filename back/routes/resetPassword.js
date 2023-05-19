const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/resetPassword');

router.post('/forgotpassword', forgotPassword);

module.exports = router;