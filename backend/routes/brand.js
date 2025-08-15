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
const {userLogin, userLogout} = require('../controllers/admin.js');
const { Category, Size } = require('../models/productoptions');


router.post('/login', brandLogin);
router.post('/logout', userLogout);

router.post('/signup', createBrand);

router.get('/', getAllBrands)

router.put('/profile/update', brandAuth, updateBrand);

router.get('/profile/:id', brandAuth, getBrandProfile);

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


router.get('/productcategories', brandAuth, async (req, res) => {
    try {
        const categories = await Category.find().sort({ category: 1 });
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});

router.get('/productsizes', brandAuth, async (req, res) => {
    try {
        const sizes = await Size.find().sort({ size: 1 });
        res.json({
            success: true,
            data: sizes
        });
    } catch (error) {
        console.error('Error fetching sizes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sizes'
        });
    }
});

// Test endpoint to verify data exists (no auth required)
router.get('/test-categories', async (req, res) => {
    try {
        const categories = await Category.find();
        console.log('Test categories found:', categories);
        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('Test categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test categories'
        });
    }
});

router.get('/test-sizes', async (req, res) => {
    try {
        const sizes = await Size.find();
        console.log('Test sizes found:', sizes);
        res.json({
            success: true,
            data: sizes,
            count: sizes.length
        });
    } catch (error) {
        console.error('Test sizes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test sizes'
        });
    }
});

router.get('/:id', getBrandById);


module.exports = router;
