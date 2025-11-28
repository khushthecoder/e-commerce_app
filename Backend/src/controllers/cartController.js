const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===================== GET CART =====================

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// ===================== ADD TO CART =====================

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          priceAtAdd: product.price
        }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

// ===================== REMOVE FROM CART =====================

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (item.cartId !== cart.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
};

// ===================== UPDATE CART ITEM =====================

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (item.cartId !== cart.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Failed to update item' });
  }
};

// ===================== CHECKOUT (PLACE ORDER) =====================

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let subtotal = 0;
    for (const it of cart.items) {
      subtotal += it.quantity * it.priceAtAdd;
    }

    const tax = +(subtotal * 0.05).toFixed(2);
    const shipping = 50;
    const total = +(subtotal + tax + shipping).toFixed(2);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        tax,
        shipping,
        status: "Paid",
        items: {
          create: cart.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.priceAtAdd
          }))
        }
      },
      include: { items: true }
    });

    for (const it of cart.items) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } }
      });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
