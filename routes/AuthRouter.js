// routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  registerMechanic,
  loginMechanic,
} = require('../controllers/AuthController');

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

router.post('/mechanic/register', registerMechanic);
router.post('/mechanic/login', loginMechanic);

module.exports = router;
