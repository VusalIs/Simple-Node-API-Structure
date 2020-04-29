const express = require('express');
const router = express.Router();
const { createUser, loginUser, activateAccount } = require('../controllers/authController');

router.post('/user/register', createUser);
router.post('/user/login', loginUser);
router.get('/verify/:token', activateAccount);

module.exports = router;
