const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany(); 
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, thumbnail, imageUrl, category, stock } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'title and price required' });
    const product = await prisma.product.create({ data: { title, description: description || '', price: Number(price), thumbnail: thumbnail || imageUrl || '', imageUrl: imageUrl || thumbnail || '', category: category || 'general', stock: Number(stock) || 0 } });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.price) data.price = Number(data.price);
    if (data.stock) data.stock = Number(data.stock);
    const product = await prisma.product.update({ where: { id: parseInt(id) }, data });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, thumbnail, imageUrl, category, stock } = req.body;
    const product = await prisma.product.create({ data: { title, description, price: parseFloat(price), thumbnail, imageUrl, category, stock: parseInt(stock || 0) } });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);
    const product = await prisma.product.update({ where: { id: parseInt(id) }, data });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};