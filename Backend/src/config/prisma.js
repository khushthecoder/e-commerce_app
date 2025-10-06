
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;    
// ye prisma client ko baad me routes me import krke use krna hai database operations k liye