const express = require('express');
const router = express.Router();
const {
    adminLogin,

    getAllBrands,
    getBrandById,
    brandApproval,
    activateBrand,
    deactivateBrand,

    getAllCustomers,
    getCustomerById,
    activateCustomer,
    deactivateCustomer,

} = require('../controllers/admin.js');
const { adminAuth } = require('../middlewares/auth.js');
const productController = require('../controllers/product');
const orderController   = require('../controllers/order');
const brandController   = require('../controllers/brand');
const customerController = require('../controllers/customer');

router.post('/login', adminLogin);

router.get('/brands', adminAuth, getAllBrands);
router.get('/brands/:id/profile', adminAuth, brandController.getBrandProfile);
router.put('/brands/:id/approve', adminAuth, brandApproval);
router.put('/brands/:id/activate', adminAuth, activateBrand);
router.put('/brands/:id/deactivate', adminAuth, deactivateBrand);

router.get('/customers', adminAuth, getAllCustomers);
router.get('/customers/:id', adminAuth, getCustomerById);
router.put('/customers/:id/activate', adminAuth, activateCustomer);
router.put('/customers/:id/deactivate', adminAuth, deactivateCustomer);

router.get('/orders', adminAuth, orderController.getOrders);
router.get('/orders/:id', adminAuth, orderController.getOrderById);
router.put('/orders/:id/status', adminAuth, orderController.updateOrderStatus);
router.put('/orders/:id/deactivate', adminAuth, orderController.deactivateOrder);


//Products
router.get('/products', adminAuth, productController.getAllProducts);
//router.get('/create', brandAuth, createProduct);
//router.get('/update/:id', brandAuth, updateProduct);
router.get('/products/:id', adminAuth, productController.getProductById);
router.put('/products/:id/activate', adminAuth, productController.activateProduct);
router.put('/products/:id/deactivate', adminAuth, productController.deactivateProduct);

module.exports = router;
