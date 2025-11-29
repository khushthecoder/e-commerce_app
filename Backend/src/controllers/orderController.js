const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) }, include: { items: { include: { product: true } } } });
    if (!order || order.userId !== userId) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total: parseFloat(totalAmount),
        tax: 0,
        shipping: 50,
        status: 'Pending',
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({ where: { id: parseInt(id) }, data: { status } });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};
