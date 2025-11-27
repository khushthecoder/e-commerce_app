const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addItem);
router.put('/item/:itemId', protect, cartController.updateItem);
router.delete('/item/:itemId', protect, cartController.removeItem);
router.post('/checkout', protect, cartController.checkout);

module.exports = router;
