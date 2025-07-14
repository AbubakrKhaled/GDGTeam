const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorhandle.js');

dotenv.config();

connectDB();

const adminRoutes = require('./routes/admin');
const brandRoutes = require('./routes/brand'); 
const customerRoutes = require('./routes/customer'); 
const productsRoutes = require('./routes/product');
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/brand', brandRoutes); 
app.use('/api/customer', customerRoutes);
app.use('/api/product', productsRoutes);

app.use(errorHandler);

app.listen( process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

