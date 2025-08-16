const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser'); // Add this line
const errorHandler = require('./middlewares/errorhandle.js');
//--------------------- admin hardcoded
const User = require('./models/User');

async function createAdmin() {
    const existingAdmin = await User.findOne({ role: 'admin', email: 'admin2@example.com' });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin2pass', 10);
        await User.create({
            name: 'admin',
            email: 'admin2@example.com',
            password: hashedPassword,
            phonenumber: 10203040,
            role: 'admin'
        });
        console.log('Admin account created.');
    } else {
        console.log('Admin already exists.');
    }
}
//-------------------------------------------
dotenv.config();

connectDB();

createAdmin(); //asdasdasdaa

const adminRoutes = require('./routes/admin');
const brandRoutes = require('./routes/brand'); 
const customerRoutes = require('./routes/customer'); 
const productsRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // url of frontend env file
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
app.use(cookieParser()); // Add this line AFTER express.json()

app.use('/api/admin', adminRoutes);
app.use('/api/brand', brandRoutes); 
app.use('/api/customer', customerRoutes);
app.use('/api/products', productsRoutes); // Changed from /api/product to /api/products
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);


app.use(errorHandler);

app.listen( process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

