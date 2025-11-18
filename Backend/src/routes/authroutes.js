const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const userController = require('../controllers/userController'); 
router.post('/register', userController.registerUser); 
router.post('/login', userController.authUser); 
router.get('/profile', protect, userController.getUserProfile); 

module.exports = router;