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
const {userLogin, userLogout} = require('../controllers/admin.js')


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
    const categories = await Category.find();
    res.json(categories);
});

router.get('/productsizes', brandAuth, async (req, res) => {
    const sizes = await Size.find();
    res.json(sizes);
});

router.get('/:id', getBrandById);


module.exports = router;
