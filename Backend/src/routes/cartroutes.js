const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.put('/item/:itemId', protect, cartController.updateCartItem);
router.delete('/item/:itemId', protect, cartController.removeFromCart);
router.post('/checkout', protect, cartController.checkout);

module.exports = router;
