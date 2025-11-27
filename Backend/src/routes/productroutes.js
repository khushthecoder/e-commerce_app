const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);


router.post('/', protect, async (req, res, next) => {
	if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
	next();
}, productController.createProduct);

router.put('/:id', protect, async (req, res, next) => {
	if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
	next();
}, productController.updateProduct);

module.exports = router;