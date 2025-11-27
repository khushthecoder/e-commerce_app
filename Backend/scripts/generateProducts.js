const fs = require('fs');
const path = require('path');

const categories = [
  'electronics','fashion','home','sports','beauty','grocery','appliances'
];

const brands = [
  'Acme','NovaTech','Lumina','Evergreen','UrbanStyle','PeakPro','Purella','Orbit','Zenith','Harvest'
];

const titles = {
  electronics: ['Wireless Headphones','Bluetooth Speaker','Smartwatch','Noise Cancelling Earbuds','Portable Charger','HD Webcam','Gaming Mouse','Mechanical Keyboard','4K Action Camera','Smart Home Hub'],
  fashion: ['Men\'s Denim Jacket','Women\'s Sundress','Running Sneakers','Leather Wallet','Classic Sunglasses','Wool Scarf','Casual T-Shirt','Formal Shirt','Denim Shorts','Ankle Boots'],
  home: ['Ceramic Vase','LED Desk Lamp','Cotton Bedsheet Set','Decorative Cushion','Area Rug','Wall Art Print','Storage Shelf','Kitchen Knife Set','Bamboo Cutting Board','Ceramic Dinner Set'],
  sports: ['Yoga Mat','Fitness Tracker','Mountain Bike Helmet','Tennis Racket','Basketball','Resistance Bands Set','Running Belt','Water Bottle','Cycling Gloves','Jump Rope'],
  beauty: ['Hydrating Face Cream','Matte Lipstick','Vitamin C Serum','Sunscreen SPF50','Organic Shampoo','Facial Cleansing Brush','Blush Palette','Nail Polish Set','Eye Serum','Hair Growth Oil'],
  grocery: ['Organic Olive Oil','Raw Honey Jar','Premium Coffee Beans','Herbal Tea Pack','Gluten-Free Flour','Almonds Pack','Quinoa Grain','Maple Syrup','Protein Bars','Brown Rice'],
  appliances: ['Air Fryer','Compact Microwave','Steam Iron','Hand Blender','Robot Vacuum','Electric Kettle','Refrigerator Mini','Portable AC','Water Purifier','Dishwasher Detergent Pack']
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals=2) {
  const v = Math.random() * (max - min) + min;
  return parseFloat(v.toFixed(decimals));
}

const total = 1100;
const products = [];
let id = 1;
for (let i = 0; i < total; i++) {
  const category = categories[i % categories.length];
  const brand = brands[i % brands.length];
  const titleList = titles[category];
  const baseTitle = titleList[i % titleList.length];
  const title = `${brand} ${baseTitle}`;
  const description = `${title} - ${baseTitle} crafted with quality materials and designed for everyday use. Ideal for users who appreciate performance and style.`;
  const price = randomFloat(100, 50000, 2);
  const stock = randomInt(0, 200);
  const discountPercentage = randomFloat(0, 70, 2);
  const rating = randomFloat(1, 5, 1);

  const image = `https:
  const images = [];
  const imageKeywords = [category, brand, 'product', 'studio'];
  const imgCount = randomInt(3,5);
  for (let j = 0; j < imgCount; j++) {
    images.push(`https:
  }

  products.push({
    id: id++,
    title,
    description,
    price,
    category,
    brand,
    rating,
    stock,
    discountPercentage,
    image,
    images
  });
}

const outDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products, null, 2));
console.log('Generated', products.length, 'products to', path.join(outDir, 'products.json'));
