const express = require('express');
const router = express.Router();
const {
    brandLogin,
    createBrand,
    updateBrand,
    getBrandById,
    getBrandProfile,
    getAllBrands
} = require('../controllers/brand.js');
const { brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const orderController   = require('../controllers/order');
const brandController   = require('../controllers/brand');
const customerController = require('../controllers/customer');

router.post('/login', brandLogin)

router.post('/signup', createBrand);

router.get('/', getAllBrands)

router.put('/profile/update', brandAuth, updateBrand);

router.get('/:id', getBrandById);
router.get('/profile', brandAuth, getBrandProfile);

router.get('/products', brandAuth, productController.getAllProducts);
router.post('/products/create', brandAuth, productController.createProduct);
router.put('/products/:id/update', brandAuth, productController.updateProduct);
router.get('/products/:id', brandAuth, productController.getProductById);
router.put('/products/:id/activate', brandAuth, productController.activateProduct);
router.put('/products/:id/deactivate', brandAuth, productController.deactivateProduct);

router.get('/orders', brandAuth, orderController.getOrders);
router.get('/orders/:id', brandAuth, orderController.getOrderById);
router.put('/orders/:id/status', brandAuth, orderController.updateOrderStatus);
router.put('/orders/:id/deactivate', brandAuth, orderController.deactivateOrder);

module.exports = router;
