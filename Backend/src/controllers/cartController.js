const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await prisma.cart.findFirst({ where: { userId }, include: { items: { include: { product: true } } } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } , include: { items: { include: { product: true } } } });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity required' });

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existing) {
      const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
      return res.json(updated);
    }

    const item = await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, priceAtAdd: product.price } });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (quantity <= 0) return res.status(400).json({ error: 'Quantity must be > 0' });

    const item = await prisma.cartItem.findUnique({ where: { id: parseInt(itemId) }, include: { cart: true } });
    if (!item || item.cart.userId !== userId) return res.status(404).json({ error: 'Item not found' });

    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const item = await prisma.cartItem.findUnique({ where: { id: parseInt(itemId) }, include: { cart: true } });
    if (!item || item.cart.userId !== userId) return res.status(404).json({ error: 'Item not found' });
    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await prisma.cart.findFirst({ where: { userId }, include: { items: { include: { product: true } } } });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    
    let subtotal = 0;
    for (const it of cart.items) subtotal += it.quantity * it.priceAtAdd;
    const tax = +(subtotal * 0.05).toFixed(2);
    const shipping = 50; 
    const total = +(subtotal + tax + shipping).toFixed(2);

    
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        tax,
        shipping,
        status: 'Paid',
        items: { create: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.priceAtAdd })) }
      },
      include: { items: true }
    });

    
    for (const it of cart.items) {
      await prisma.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });
    }

    
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
