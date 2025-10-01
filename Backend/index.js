const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const productRoutes = require('./src/routes/product.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));