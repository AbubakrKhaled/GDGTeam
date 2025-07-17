const express = require('express');
const router = express.Router();
const { getCartDetails } = require('../controllers/order.js');
const {
    customerLogin,
    updateCustomer,

} = require('../controllers/customer.js')
const { customerAuth, adminAuth, brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');

router.get('/cart', customerAuth, getCartDetails);

router.post('/', customerLogin);
router.put('/update', customerAuth, updateCustomer);