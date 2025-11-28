const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', protect, orderController.createOrder);
router.get('/history', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;
