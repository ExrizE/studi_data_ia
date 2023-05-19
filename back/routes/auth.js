const express = require('express');
const router = express.Router();
const { login, register, authorizeUser, logout, approveUser, getUsers } = require('../controllers/auth');
const { auth, authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/authorize/:userId', auth, authorizeUser);
router.post('/logout', auth, logout);
router.patch('/approve/:userId', auth, approveUser);
router.get('/users', authenticateToken, requireAdmin, getUsers);

module.exports = router;