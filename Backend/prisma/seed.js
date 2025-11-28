const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const categories = [
  "Shoes",
  "Electronics",
  "Mobiles",
  "Laptops",
  "Fashion",
  "Home",
  "Kitchen",
  "Gaming",
  "Toys",
  "Fitness",
  "Watches",
  "Beauty",
  "Smart Devices",
  "Bags",
  "Accessories"
];

function generateProduct(i) {
  const category = categories[randomInt(0, categories.length - 1)];
  const baseNames = {
    Shoes: ["Running Shoes", "Sports Sneakers", "Casual Shoes", "Training Shoes"],
    Electronics: ["Bluetooth Speaker", "Smart LED Bulb", "Portable Fan", "Smart Plug"],
    Mobiles: ["Android Smartphone", "Flagship Phone", "Budget Phone", "5G Mobile"],
    Laptops: ["Gaming Laptop", "Ultrabook", "Business Laptop", "Student Laptop"],
    Fashion: ["Cotton T-Shirt", "Casual Jacket", "Denim Jeans", "Hoodie"],
    Home: ["Bedsheet Set", "Curtains", "Soft Pillow", "Home Organizer"],
    Kitchen: ["Mixer Grinder", "Air Fryer", "Nonstick Pan", "Knife Set"],
    Gaming: ["Gaming Mouse", "Mechanical Keyboard", "Headset", "Controller"],
    Toys: ["Building Blocks", "Remote Car", "Puzzle Set", "Soft Toy"],
    Fitness: ["Dumbbells", "Yoga Mat", "Skipping Rope", "Resistance Bands"],
    Watches: ["Smartwatch", "Analog Watch", "Digital Watch", "Sports Watch"],
    Beauty: ["Face Serum", "Hair Dryer", "Shampoo", "Beard Oil"],
    Smart Devices: ["Smartwatch Ultra", "Smart Band", "Smart Tracker", "Home Camera"],
    Bags: ["Laptop Bag", "Travel Backpack", "Casual Sling Bag", "Gym Bag"],
    Accessories: ["Sunglasses", "Wallet", "Belt", "Cap"]
  };

  const nameList = baseNames[category];
  const name = nameList[randomInt(0, nameList.length - 1)] + " " + randomInt(100, 999);

  return {
    name,
    description: `High-quality ${name.toLowerCase()} perfect for daily use. Durable and stylish design.`,
    price: randomInt(199, 49999),
    stock: randomInt(5, 200),
    image: `https://source.unsplash.com/random/800x800/?${category},product,${i}`
  };
}

async function main() {
  const products = [];
  for (let i = 1; i <= 1000; i++) {
    products.push(generateProduct(i));
  }

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
