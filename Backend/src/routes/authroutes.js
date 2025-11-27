const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const authController = require('../controllers/authcontroller'); 
router.post('/register', authController.registerUser); 
router.post('/login', authController.loginUser); 
router.get('/profile', protect, authController.getMe); 
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

module.exports = router;