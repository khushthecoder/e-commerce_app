const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  await prisma.product.deleteMany();

  const response = await fetch('https://dummyjson.com/products?limit=20');
  const { products } = await response.json();

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        thumbnail: p.thumbnail,
        category: p.category,
        stock: p.stock,
      },
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());