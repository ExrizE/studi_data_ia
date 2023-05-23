const express = require('express');
const router = express.Router();
const { login, register, authorizeUser, logout, approveUser, getUsers, refreshToken } = require('../controllers/auth');
const { auth, authenticateRefreshToken, requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.patch('/authorize/:userId', auth, requireAdmin, authorizeUser);
router.post('/logout', logout);
router.patch('/approve/:userId', auth, requireAdmin, approveUser);
router.get('/users', auth, requireAdmin, getUsers);
router.post('/refresh', authenticateRefreshToken, refreshToken);

module.exports = router;