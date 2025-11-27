const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importProducts() {
  const file = path.join(__dirname, '..', 'data', 'products.json');
  if (!fs.existsSync(file)) {
    console.error('products.json not found in backend/data');
    process.exit(1);
  }
  const raw = fs.readFileSync(file, 'utf8');
  const products = JSON.parse(raw);
  console.log('Importing', products.length, 'products...');

  
  const batchSize = 200;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize).map(p => ({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.image,
      imageUrl: p.images && p.images.length ? p.images[0] : p.image,
      category: p.category,
      stock: p.stock
    }));
    await prisma.product.createMany({ data: batch, skipDuplicates: true });
    console.log('Imported batch', i / batchSize + 1);
  }

  console.log('Import complete');
  process.exit(0);
}

importProducts().catch(err => { console.error(err); process.exit(1); });
