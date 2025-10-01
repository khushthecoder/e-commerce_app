const prisma = require('../config/prisma');
exports.getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
};