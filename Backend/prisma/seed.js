const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding products...');

  const product1 = await prisma.product.create({
    data: {
      title: 'Men\'s Running Shoes',
      description: 'Comfortable and lightweight shoes for daily running.',
      price: 2499.00,
      stock: 50,
      imageUrl: 'https:
      thumbnail: 'https:
      category: 'Footwear',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: 'Wireless Bluetooth Headphones',
      description: 'High-quality sound with 20 hours battery backup.',
      price: 1899.50,
      stock: 120,
      imageUrl: 'https:
      thumbnail: 'https:
      category: 'Electronics',
    },
  });

  console.log(`Created product: ${product1.title}`);
  console.log(`Created product: ${product2.title}`);
  console.log('Product seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
